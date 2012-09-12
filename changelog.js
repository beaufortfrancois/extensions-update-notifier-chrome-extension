var changelog = document.getElementById('changelog');
changelog.innerHTML = chrome.i18n.getMessage('loadingChangelogText');

var extension = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));

var title = chrome.i18n.getMessage('titleChangelogText', [extension.name]);
document.getElementById('title').textContent = title;
document.title = title;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://chrome.google.com/webstore/detail/' + extension.id, true);
xhr.setRequestHeader("Cache-Control","no-cache,max-age=0");

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var r = this.response;
    // Check what's inside <pre></pre> tags
    var text = r.substring(r.search('<pre '), r.search('</pre>')+6)

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

xhr.send();
