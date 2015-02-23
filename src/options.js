var showChangelogCheckbox = document.querySelector('#showChangelog');
var autoCloseNotificationCheckbox = document.querySelector('#autoCloseNotification');
var alwaysDisableExtensionCheckbox = document.querySelector('#alwaysDisableExtension');

// Saves synced options.
function saveOptions() {
  var showChangelog = showChangelogCheckbox.checked;
  var autoCloseNotification = autoCloseNotificationCheckbox.checked;
  var alwaysDisableExtension = alwaysDisableExtensionCheckbox.checked;
  chrome.storage.sync.set({
    showChangelog: showChangelog,
    autoCloseNotification: autoCloseNotification,
    alwaysDisableExtension: alwaysDisableExtension,
  });
}

// Restores synced preferences.
window.onload = function() {
  localize();

  var defaultOptions = {
    showChangelog: DEFAULT_OPTIONS.SHOW_CHANGELOG,
    autoCloseNotification: DEFAULT_OPTIONS.AUTO_CLOSE_NOTIFICATION,
    alwaysDisableExtension: DEFAULT_OPTIONS.ALWAYS_DISABLE_EXTENSION,
  };
  chrome.storage.sync.get(defaultOptions, function(results) {
    showChangelogCheckbox.checked = results.showChangelog;
    autoCloseNotificationCheckbox.checked = results.autoCloseNotification;
    alwaysDisableExtensionCheckbox.checked = results.alwaysDisableExtension;
  });
  showChangelogCheckbox.onchange = saveOptions;
  autoCloseNotificationCheckbox.onchange = saveOptions;
  alwaysDisableExtensionCheckbox.onchange = saveOptions;
}
