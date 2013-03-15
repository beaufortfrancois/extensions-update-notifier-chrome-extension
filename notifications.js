// TODO: To remove
localStorage.eignhdfgaldabilaaegmdfbajngjmoke = '0';
localStorage.knmdbhdejcjgpahocbnbbekpaehgghnk = '0';
localStorage.gighmmpiobklfepjocnamgkkbiglidom = '0';

// Helper function to return extension Icon Url based on extension Id
function getExtensionIconUrl(extensionId) {
  var extensionId = extensionId || chrome.runtime.id;
  return 'chrome://extension-icon/'+ extensionId +'/128/0';
}

// Helper function to show a notification
function showNotification(notificationId, options) {
  chrome.notifications.create(notificationId, options, function(){});
}

// Show a notification that an extension has been updated
function showExtensionUpdateNotification(extension, oldVersion) {
  var options = {
    type : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('updatedExtensionMessage', [extension.name, extension.version, oldVersion]),
    iconUrl: getExtensionIconUrl(extension.id),
    buttons: []
  };
  // Don't show any buttons if it's a development extension
  if (extension.installType !== 'development') {

    // Add a "Visit website" button if it has one website
    if (extension.homepageUrl) {
      options.buttons.push({
        title: chrome.i18n.getMessage('websiteButtonTitle'),
        iconUrl: chrome.extension.getURL('images/website_16.png')
      });
      // And add a "Open changelog" button if the extension is enabled
      if (extension.enabled) {
        options.buttons.push({
          title: chrome.i18n.getMessage('changelogButtonTitle'),
          iconUrl: chrome.extension.getURL('images/16.png')
        }); 
      }
    }
    // Make the icon gray and add an "Enable" button if the extension is disabled
    if (!extension.enabled) {
      options.iconUrl += '?grayscale=true';
      options.buttons.push({
        title: chrome.i18n.getMessage('enableButtonTitle'),
        iconUrl: chrome.extension.getURL('images/16.png')
      });
    }
  }
  showNotification(extension.id, options);
}

// Show a notification that an extension has been enabled
function showExtensionEnabledNotification(extension) {
  var options = {
    type : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('enabledExtensionMessage', [extension.name]),
    iconUrl : getExtensionIconUrl(extension.id)
  };
  showNotification(extension.id, options);
}

// Clear notifications on Click
chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.notifications.clear(notificationId, function(){});
});

// Handle notifications actions on button Click
chrome.notifications.onButtonClicked.addListener(function(extensionId, buttonIndex) {
  chrome.management.get(extensionId, function(extension) {
    if (extension.homepageUrl) {
      if (buttonIndex === 0) {
        chrome.tabs.create({ 'url': extension.homepageUrl });
      } else if (buttonIndex === 1) {
        if (extension.enabled) {
          chrome.tabs.create({ 'url': chrome.extension.getURL('changelog.html#'+ extensionId) });
        } else {
          enableExtension(extension, showExtensionEnabledNotification);
        }
      }
    } else {
      enableExtension(extension, showExtensionEnabledNotification);
    }
  });
});

// Display a Welcome notification if this extension is installed for the first time
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    var options = {
      type : 'basic',
      title: chrome.i18n.getMessage('welcomeTitle'),
      message: chrome.i18n.getMessage('welcomeText'),
      iconUrl : getExtensionIconUrl()
    };
    showNotification('welcome', options);
  }
});
