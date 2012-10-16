// Helper function to show a notification
function showNotification(extension, url) {

  var url = url || 'notification.html';

  if (extension) {
    // Save temporary the old version to display it in the notification
    extension.oldVersion = localStorage[extension.id];
    url += '#' + encodeURIComponent(JSON.stringify(extension));
  }

  webkitNotifications.createHTMLNotification(url).show();
}

if (!localStorage._hasDisplayedWelcomeMessage) {

  // Display a Welcome notification
  showNotification();

  localStorage._hasDisplayedWelcomeMessage = true;
}

function checkMalware(extension) {

  var hasAlreadyBeenViewed = false,
      watchList = localStorage._watchList && JSON.parse(localStorage._watchList);

  if (watchList && watchList.indexOf(extension.id) !== -1) {
    hasAlreadyBeenViewed = true;
  }

  // If user did not install extension (not app) consciously and has not already acknowledged, we should ask him
  if (extension.isApp === false && extension.installType === 'sideload' && hasAlreadyBeenViewed === false) {
    showNotification(extension, 'warning.html');
  }
}

function checkExtensionVersion(extension) {

  checkMalware(extension);

  if (localStorage[extension.id] && (localStorage[extension.id] != extension.version) ) {
    showNotification(extension);
  }
    
  // Store new version of this extension
  localStorage[extension.id] = extension.version;
}

chrome.management.getAll(function (extensions) {

  // Store versions of installed extensions once
  extensions.forEach(function (extension) {
    checkExtensionVersion(extension);
  });

  // Show a notification each time a new version of an extension is installed
  chrome.management.onInstalled.addListener(function (extension) {
    checkExtensionVersion(extension);
  });
});
