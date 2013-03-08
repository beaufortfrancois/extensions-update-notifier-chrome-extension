// TODO: To remove
localStorage.knmdbhdejcjgpahocbnbbekpaehgghnk = '0';
localStorage.eignhdfgaldabilaaegmdfbajngjmoke = '0';

// TODO: To remove when API is stable
chrome.notifications = chrome.notifications || chrome.experimental.notification;

function showUpdateNotification(extension) {

  var iconUrl = 'chrome://extension-icon/'+ extension.id +'/128/0'; 
  var buttons = [];

  // Don't show any buttons if it's a development extension
  if (extension.installType !== 'development') {

    // Add "Visit website" button if it has one website
    if (extension.homepageUrl) {
      buttons.push({
        title: chrome.i18n.getMessage('websiteButtonTitle'),
        iconUrl: chrome.extension.getURL('images/website_16.png')
      });
    }

    // Make the icon gray and the "Enable" button if the extension is disabled
    if (!extension.enabled) {
      iconUrl += '?grayscale=true';

      buttons.push({
        title: chrome.i18n.getMessage('enableButtonTitle'),
        iconUrl: chrome.extension.getURL('images/16.png')
      });
    }

    // If the extension has a homepage and is enabled, add the "Open changelog" button
    if (extension.homepageUrl && extension.enabled) {
      buttons.push({
        title: chrome.i18n.getMessage('changelogButtonTitle'),
        iconUrl: chrome.extension.getURL('images/16.png')
      }); 
    }
  }

  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('updatedExtensionMessage', [extension.name, extension.version]),
    iconUrl: iconUrl,
    buttons: buttons
  };

  chrome.notifications.onButtonClicked.addListener(function(extensionId, buttonIndex) {

    chrome.management.get(extensionId, function(extension) {
    
      // TODO: Figure out a way to handle properly...
      if (extension.homepageUrl) {
        if (buttonIndex === 0) {
          chrome.tabs.create({ 'url': extension.homepageUrl });
        } else if (buttonIndex === 1) {
          if (extension.enabled) {
            chrome.tabs.create({ 'url': chrome.extension.getURL('changelog.html') + '#' + extensionId });
          } else {
            chrome.management.setEnabled(extensionId, true, function() {
              showEnabledNotification(extension);
            });
          }
        }
      } else {
        chrome.management.setEnabled(extensionId, true, function() {
          showEnabledNotification(extension);
        });
      }
    });
  });
 
  // Clear notification on click
  chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.notifications.clear(notificationId, function(wasCleared){
      console.log(wasCleared);
    });
  });

  // Show notification
  chrome.notifications.create(extension.id, options, function(){});

}

function showEnabledNotification(extension) {
  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('enabledExtensionMessage', [extension.name]),
    iconUrl : 'chrome://extension-icon/'+ extension.id +'/128/0'
  };
  chrome.notifications.create(extension.id, options, function(){});
}


// Display a Welcome notification
if (!localStorage._hasDisplayedWelcomeMessage) {

  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('welcomeTitle'),
    message: chrome.i18n.getMessage('welcomeText'),
    iconUrl : 'chrome://extension-icon/'+ chrome.app.getDetails().id +'/128/1'
  };
  chrome.notifications.create('welcome', options, function(){
    localStorage._hasDisplayedWelcomeMessage = true;
  });

}

function checkExtensionVersion(extension) {

  if (localStorage[extension.id] && (localStorage[extension.id] != extension.version) ) {
    showUpdateNotification(extension);
  }
    
  // Store new version of this extension
  localStorage[extension.id] = extension.version;
}

chrome.management.getAll(function(extensions) {

  // Store versions of installed extensions once
  extensions.forEach(function(extension) {
    checkExtensionVersion(extension);
  });

  // Show a notification each time a new version of an extension is installed
  chrome.management.onInstalled.addListener(function(extension) {
    checkExtensionVersion(extension);
  });
});
