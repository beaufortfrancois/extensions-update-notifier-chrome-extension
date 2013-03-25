var changelog = document.getElementById('changelog');

var message = document.getElementById('message');
message.innerText = chrome.i18n.getMessage('requestPermissionsText');

var showChangelogButton = document.getElementById('showChangelogButton');
showChangelogButton.innerText = chrome.i18n.getMessage('changelogButtonTitle');

var extension = null;
var extensionId = window.location.hash.substr(1);

chrome.management.get(extensionId, function(extension) {
  document.getElementById('title').textContent = extension.name;
  document.title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
});

function toggleChangelogVisibility(visibility) {
  if (visibility) {
    showChangelogButton.style.display = 'none';
    message.style.display = 'none';
    changelog.style.display = 'block';
  } else {
    message.style.display = 'block';
    changelog.style.display = 'none';
  }
}

function showChangelog() {
  toggleChangelogVisibility(true);

  // Display loading message.
  message.innerText = chrome.i18n.getMessage('loadingChangelogText');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://chrome.google.com/webstore/detail/' + extensionId, true);
  xhr.onload = function() {
    var r = xhr.response;
    // Check what's inside <pre></pre> tags.
    var text = r.substring(r.search('<pre '), r.search('</pre>')+6);

    // And only if the word "changelog" is inside, we assume there is a changelog.
    if (text.search(/changelog/i) !== -1) {
      // I trust the Chrome Web Store here ;)
      changelog.innerText = text.substring(text.search(/changelog/i), text.length-6);
    } else {
      toggleChangelogVisibility(false);
      message.innerText = chrome.i18n.getMessage('sorryChangelogText');
    }
  };
  xhr.onerror = function() {
    toggleChangelogVisibility(false);
    message.innerText = chrome.i18n.getMessage('sorryChangelogText');
  };
  xhr.send(null);
}

var permissions = { origins: chrome.runtime.getManifest().optional_permissions };

// Request permissions when user clicks on Request button.
showChangelogButton.addEventListener('click', function() {
  chrome.permissions.request(permissions, function(hasGranted) {
    if (hasGranted) {
      showChangelog();
    }
  });
});

// Show changelog if user already granted permissions.
chrome.permissions.contains(permissions, function(result) {
  if (result) {
    showChangelog();
  }
});
