var NO_PERMISSIONS_GRANTED = 'NO_PERMISSIONS_GRANTED';

var DEFAULT_OPTIONS = {
  ALWAYS_DISABLE_EXTENSION: false,
  AUTO_CLOSE_NOTIFICATION: false,
  SHOW_CHANGELOG: true,
}

// Localize all content.
function localize() {
  var elements = document.querySelectorAll('[i18-content]');
  for (var element, i = 0; element = elements[i]; i++) {
    var messageName = element.getAttribute('i18-content');
    element.textContent = chrome.i18n.getMessage(messageName);
  }
}

// Attempts to get changelog if webstore extension page has one.
function getWebstoreChangelog(extensionId, successCallback, errorCallback) {
  var permissions = { origins: ['https://chrome.google.com/*'] };
  chrome.permissions.contains(permissions, function(result) {
    if (!result) {
      errorCallback(NO_PERMISSIONS_GRANTED);
      return;
    }
    var webstoreUrl = 'https://chrome.google.com/webstore/detail/'+ extensionId;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', webstoreUrl, true);
    xhr.onload = function() {
      // Retrieve what's inside <pre></pre>.
      var text = xhr.response.substring(xhr.response.search('<pre '),
          xhr.response.search('</pre>')+6);

      // We assume there is a changelog,
      // If the word "changelog" is inside.
      if (text.search(/changelog/i) !== -1) {
        successCallback(text.substring(text.search(/changelog/i), text.length));
      // If the version number is inside.
      } else if (text.indexOf(localStorage[extensionId]) !== -1) {
        var index = text.indexOf(localStorage[extensionId]);
        while (index >0 && text[index].charCodeAt(0) !== 10) {
            index--;
        }
        successCallback(text.substring(index, text.length));
      // If the word "What's new" is inside.
      } else if (text.search(/What&#39;s new/i) !== -1) {
        successCallback(text.substring(text.search(/What&#39;s new/i), text.length));
      } else {
        errorCallback();
      }
    };
    xhr.onerror = errorCallback;
    xhr.send(null);
  });
}
