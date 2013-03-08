var changelog = document.getElementById('changelog');

var extension = null;
var extensionId = window.location.hash.substr(1);

chrome.management.get(extensionId, function(extension) {
  document.getElementById('title').textContent = extension.name;
  document.title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
});

function showChangelog() {
// Display loading message
changelog.innerHTML = chrome.i18n.getMessage('loadingChangelogText');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://chrome.google.com/webstore/detail/' + extensionId, true);
xhr.setRequestHeader("Cache-Control","no-cache,max-age=0");

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var r = this.response;
    // Check what's inside <pre></pre> tags
    var text = r.substring(r.search('<pre '), r.search('</pre>')+6);

    // And only if the word "changelog" is inside, we assume there is a changelog
    if (text.search(/changelog/i) !== -1) {
      // I trust the Chrome Web Store here ;)
      changelog.innerHTML = text.substring(text.search(/changelog/i), text.length-6);
    } else {
      changelog.style.display = 'none';
      document.getElementById('sorry').innerHTML = chrome.i18n.getMessage('sorryChangelogText');
    }
  }
};

xhr.send(null);

}

var permissions = { origins: ['https://chrome.google.com/*'] };

chrome.permissions.contains(permissions, function(hasPermissions) {
  if (hasPermissions) {
    showChangelog();
  } else {
    changelog.innerHTML = 'This feature requests an additional permission. Click anywhere to get permissions prompt';
    document.addEventListener('click', function() {
      chrome.permissions.request(permissions, function(granted) {
        if (granted) {
          showChangelog();
        }
      });
    });
  }
});
