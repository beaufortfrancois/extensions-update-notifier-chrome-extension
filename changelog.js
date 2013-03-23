var changelog = document.getElementById('changelog');

var sorry = document.getElementById('sorry');
sorry.innerText = chrome.i18n.getMessage('requestPermissionsText');

var showChangelogButton = document.getElementById('showChangelogButton');
showChangelogButton.innerText = chrome.i18n.getMessage('changelogButtonTitle');

var extension = null;
var extensionId = window.location.hash.substr(1);

chrome.management.get(extensionId, function(extension) {
  document.getElementById('title').textContent = extension.name;
  document.title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
});

function showChangelog() {
  showChangelogButton.style.display = 'none';
  sorry.style.display = 'none';

  // Display loading message
  changelog.innerText = chrome.i18n.getMessage('loadingChangelogText');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://chrome.google.com/webstore/detail/' + extensionId, true);
  xhr.onload = function() {
    var r = xhr.response;
    // Check what's inside <pre></pre> tags
    var text = r.substring(r.search('<pre '), r.search('</pre>')+6);

    // And only if the word "changelog" is inside, we assume there is a changelog
    if (text.search(/changelog/i) !== -1) {
      // I trust the Chrome Web Store here ;)
      changelog.innerHTML = text.substring(text.search(/changelog/i), text.length-6);
    } else {
      changelog.style.display = 'none';
      sorry.style.display = 'block';
      sorry.innerText = chrome.i18n.getMessage('sorryChangelogText');
    }
  };
  xhr.send(null);
}


// Permissions handling

var permissions = { origins: ['https://chrome.google.com/*'] };

showChangelogButton.addEventListener('click', function() {
  chrome.permissions.request(permissions, function(hasGranted) {
    if (hasGranted) {
      showChangelog();
    }
  });
});

chrome.permissions.contains(permissions, function(result) {
  if (result) {
    showChangelog();
  }
});
