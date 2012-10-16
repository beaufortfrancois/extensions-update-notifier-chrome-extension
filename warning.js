var extension = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));

var text = document.getElementById('text');
text.innerHTML = chrome.i18n.getMessage('warningExtensionText', [extension.name]);

var addToWatchList = function(extensionId) {
  var watchList = (localStorage._watchList && JSON.parse(localStorage._watchList)) || [];
  if (watchList.indexOf(extension.id) === -1) {
    watchList.push(extension.id);
    localStorage._watchList = JSON.stringify(watchList);
  }
};

var disable = document.getElementById('disable');
disable.textContent = chrome.i18n.getMessage('disableText');
disable.addEventListener('click', function() {
  chrome.management.setEnabled(''+extension.id, false, function() {
    addToWatchList(extension.id);
  });
});

var confirm = document.getElementById('confirm');
confirm.textContent = chrome.i18n.getMessage('confirmText');
confirm.addEventListener('click', function() {
  addToWatchList(extension.id);
});

// Close notification on simple click
document.addEventListener('click', function() { 
  close(); 
});
