var alwaysDisableExtensionCheckbox = document.querySelector('#alwaysDisableExtension');

// Saves synced options.
function saveOptions() {
  var alwaysDisableExtension = alwaysDisableExtensionCheckbox.checked;
  chrome.storage.sync.set({
    alwaysDisableExtension: alwaysDisableExtension
  });
}

// Localize all content.
function localize() {
  var elements = document.querySelectorAll('[i18-content]');
  for (var element, i = 0; element = elements[i]; i++) {
    var messageName = element.getAttribute('i18-content');
    element.textContent = chrome.i18n.getMessage(messageName);
  }
}

// Restores synced preferences.
window.onload = function() {
  localize();

  var defaultOptions = {
    alwaysDisableExtension: false
  };
  chrome.storage.sync.get(defaultOptions, function(results) {
    alwaysDisableExtensionCheckbox.checked = results.alwaysDisableExtension;
  });
  alwaysDisableExtensionCheckbox.onchange = saveOptions;
}
