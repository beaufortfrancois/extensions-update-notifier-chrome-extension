var changelog = document.getElementById('changelog');
var message = document.getElementById('message');
var source = document.getElementById('source');
var showChangelogButton = document.getElementById('showChangelogButton');

var extensionId = window.location.hash.substr(1);
var sourceUrl = 'https://chrome.google.com/webstore/detail/'+ extensionId; 

function showSorryMessage() {
  changelog.style.display = 'none';
  message.style.display = 'block';
  message.classList.add('sorry');
  message.textContent = chrome.i18n.getMessage('sorryMessageText');
}

// Show captured changelog from the Chrome Web Store.
function showChangelog() {
  // Show/hide DOM Elements.
  showChangelogButton.style.display = 'none';
  message.style.display = 'none';
  changelog.style.display = 'block';
  source.href = sourceUrl;
  source.textContent = sourceUrl;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', sourceUrl, true);
  xhr.onloadstart = function() {
    message.textContent = chrome.i18n.getMessage('loadingMessageText');
  }
  xhr.onload = function() {
    // Retrieve what's inside <pre></pre>.
    var text = xhr.response.substring(xhr.response.search('<pre '),
        xhr.response.search('</pre>')+6);

    // We assume there is a changelog,
    // If the word "changelog" is inside.
    if (text.search(/changelog/i) !== -1) {
      changelog.innerHTML = text.substring(text.search(/changelog/i), text.length);
    // If the version number is inside.
    } else if (text.indexOf(localStorage[extensionId]) !== -1) {
      var index = text.indexOf(localStorage[extensionId]);
      while (index >0 && text[index].charCodeAt(0) !== 10) {
          index--;
      }
      changelog.innerHTML = text.substring(index, text.length);
    // If the word "What's new" is inside.
    } else if (text.search(/What&#39;s new/i) !== -1) {
      changelog.innerHTML = text.substring(text.search(/What&#39;s new/i), text.length);
    } else {
      showSorryMessage();
    }
  };
  xhr.onerror = showSorryMessage;
  xhr.send(null);
}

var permissions = { origins: chrome.runtime.getManifest().optional_permissions };

// Request permissions when user clicks on Request button.
showChangelogButton.addEventListener('click', function() {
  chrome.permissions.request(permissions, function(hasGranted) {
    if (hasGranted)
      showChangelog();
  });
});

window.onload = function() {
  localize();

  chrome.management.get(extensionId, function(extension) {
    var title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
    document.getElementById('title').textContent = title;
    document.title = title;
  });

  // Show changelog if user already granted permissions.
  chrome.permissions.contains(permissions, function(result) {
    if (result)
      showChangelog();
  });
}
