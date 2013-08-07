// Helper function which enables an extension.
function enableExtension(extension, callback) {
  chrome.management.setEnabled(extension.id, true, function() {
    callback(extension);
  });
}

// Check if the extension has been updated.
function checkExtensionVersion(extension) {
  // Ignore extensions in development.
  if (extension.installType !== 'development') {
    // Show a notification if the extension version has changed.
    var currentVersion = localStorage[extension.id];
    if (currentVersion && (currentVersion !== extension.version)) {
      // And if the user hasn't already seen this notification.
      var notificationId = getNotificationId(extension);
      chrome.storage.sync.get(notificationId, function(results) {
        if (results[notificationId] !== 'closedByUser')
          showExtensionUpdateNotification(extension, currentVersion);
      });
    }
    // Store new version of this extension.
    localStorage[extension.id] = extension.version;
  }
}

// Check and save all installed extensions once.
chrome.management.getAll(function(extensions) {
  extensions.forEach(function(extension) {
    checkExtensionVersion(extension);
  });
});

// Register a listener to when an extension is installed.
chrome.management.onInstalled.addListener(checkExtensionVersion);
