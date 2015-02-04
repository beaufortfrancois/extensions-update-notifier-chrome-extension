var alwaysDisableExtensionCheckbox = document.querySelector('#alwaysDisableExtension');

// Saves synced options.
function saveOptions() {
  var alwaysDisableExtension = alwaysDisableExtensionCheckbox.checked;
  chrome.storage.sync.set({
    alwaysDisableExtension: alwaysDisableExtension
  });
}

// Restores synced preferences.
window.onload = function() {
  var defaultOptions = {
    alwaysDisableExtension: false
  };
  chrome.storage.sync.get(defaultOptions, function(results) {
    alwaysDisableExtensionCheckbox.checked = results.alwaysDisableExtension;
  });
  alwaysDisableExtensionCheckbox.onchange = saveOptions;
}
