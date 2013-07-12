var changelog = document.getElementById('changelog');
var message = document.getElementById('message');
var showChangelogButton = document.getElementById('showChangelogButton');

var extensionId = window.location.hash.substr(1);

function showSorryMessage() {
  changelog.style.display = 'none';
  message.style.display = 'block';
  message.classList.add('sorry');
  message.innerText = chrome.i18n.getMessage('sorryMessageText');
}

// Show captured changelog from the Chrome Web Store.
function showChangelog() {
  // Show/hide DOM Elements.
  showChangelogButton.style.display = 'none';
  message.style.display = 'none';
  changelog.style.display = 'block';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://chrome.google.com/webstore/detail/'+ extensionId, true);
  xhr.onloadstart = function() {
    message.innerText = chrome.i18n.getMessage('loadingMessageText');
  }
  xhr.onload = function() {
    // Retrieve what's inside <pre></pre>.
    var text = xhr.response.substring(xhr.response.search('<pre '),
        xhr.response.search('</pre>')+6);

    // If the word "changelog" is inside, we assume there is a changelog.
    if (text.search(/changelog/i) !== -1) {
      changelog.innerHTML = text.substring(text.search(/changelog/i), text.length-6);
    // If the version number is inside, we also assume there is a changelog.
    } else if (text.indexOf(localStorage[extensionId]) !== -1) {
        var index = text.indexOf(localStorage[extensionId]);
        while (text[index].charCodeAt(0) !== 10 && index >= 0) {
            index--;
        }
        changelog.innerHTML = text.substring(index, text.length-6);
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
    if (hasGranted) {
      showChangelog();
    }
  });
});

window.onload = function() {
  message.innerText = chrome.i18n.getMessage('requestPermissionsText');
  showChangelogButton.innerText = chrome.i18n.getMessage('showChangelogButtonText');

  chrome.management.get(extensionId, function(extension) {
    var title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
    document.getElementById('title').innerText = title;
    document.title = title;
  });

  // Show changelog if user already granted permissions.
  chrome.permissions.contains(permissions, function(result) {
    if (result) {
      showChangelog();
    }
  });

}
