var showChangelogCheckbox = document.querySelector('#showChangelog');
var alwaysDisableExtensionCheckbox = document.querySelector('#alwaysDisableExtension');

// Saves synced options.
function saveOptions() {
  var alwaysDisableExtension = alwaysDisableExtensionCheckbox.checked;
  var showChangelog = showChangelogCheckbox.checked;
  chrome.storage.sync.set({
    showChangelog: showChangelog,
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
    showChangelog: DEFAULT_OPTIONS.SHOW_CHANGELOG,
    alwaysDisableExtension: DEFAULT_OPTIONS.ALWAYS_DISABLE_EXTENSION
  };
  chrome.storage.sync.get(defaultOptions, function(results) {
    showChangelogCheckbox.checked = results.showChangelog;
    alwaysDisableExtensionCheckbox.checked = results.alwaysDisableExtension;
  });
  showChangelogCheckbox.onchange = saveOptions;
  alwaysDisableExtensionCheckbox.onchange = saveOptions;
}
