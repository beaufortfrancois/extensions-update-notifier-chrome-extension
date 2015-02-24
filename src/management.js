// Helper function which enables an extension.
function setEnabledExtension(extension, enabled, callback) {
  chrome.management.setEnabled(extension.id, enabled, function() {
    extension.enabled = enabled;
    callback(extension);
  });
}

// Helper function which uninstalls an extension.
function uninstallExtension(extension, callback) {
  chrome.management.uninstall(extension.id, function(e) {
    if (!chrome.runtime.lastError) {
      callback(extension);
    }
  })
}

// Check if the extension has been updated.
function checkExtensionVersion(extension) {
  // Ignore extensions in development (except us).
  if (extension.installType !== 'development' || extension.id === chrome.runtime.id) {
    // Show a notification if the extension version has changed.
    var currentVersion = localStorage[extension.id];
    if (currentVersion && (currentVersion !== extension.version)) {
      // And if the user hasn't already seen this notification.
      var notificationId = getNotificationId(extension);
      chrome.storage.sync.get(notificationId, function(results) {
        if (results[notificationId] !== 'closedByUser') {
          // Disable extension first if user has chosen to.
          chrome.storage.sync.get({'alwaysDisableExtension' : DEFAULT_OPTIONS.ALWAYS_DISABLE_EXTENSION}, function(results) {
            if (results['alwaysDisableExtension'] && extension.id !== chrome.runtime.id) {
              setEnabledExtension(extension, false, function(extension) {
                showExtensionUpdateNotification(extension, currentVersion);
              });
            } else {
              showExtensionUpdateNotification(extension, currentVersion);
            }
          });
        }
      });
    }
    // Store new version of this extension.
    localStorage[extension.id] = extension.version;
  }
}

// Dismiss extension notifications when extension is disabled.
function onExtensionDisabled(extension) {
  closeExtensionNotifications(extension.id);
}

// Check and save all installed extensions once.
chrome.management.getAll(function(extensions) {
  extensions.forEach(function(extension) {
    checkExtensionVersion(extension);
  });
});

// Register all listeners.
chrome.management.onInstalled.addListener(checkExtensionVersion);
chrome.management.onDisabled.addListener(onExtensionDisabled);
