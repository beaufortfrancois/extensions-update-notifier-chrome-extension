// Helper function which enables an extension.
function enableExtension(extension, callback) {
  chrome.management.setEnabled(extension.id, true, function() {
    callback(extension);
  });
}

// Show a notification if the extension version has changed.
function checkExtensionVersion(extension) {
  // Ignore extensions in development.
  if (extension.installType !== 'development') {
    var currentVersion = localStorage[extension.id];
    if (currentVersion && (currentVersion !== extension.version)) {
      showExtensionUpdateNotification(extension, currentVersion);
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
// Listen to when an extension is installed.
chrome.management.onInstalled.addListener(checkExtensionVersion);
