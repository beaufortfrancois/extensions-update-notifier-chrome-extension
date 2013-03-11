// TODO: To remove
localStorage.knmdbhdejcjgpahocbnbbekpaehgghnk = '0';
localStorage.eignhdfgaldabilaaegmdfbajngjmoke = '0';
localStorage.mhmmajefehoodegeclhdlphahchnhfjk = '0';

// TODO: To remove when API is stable
chrome.notifications = chrome.notifications || chrome.experimental.notification;

function getExtensionIconUrl(extensionId) {
  var extensionId = extensionId || chrome.runtime.id;
  return 'chrome://extension-icon/'+ extensionId +'/128/0';
}

function showUpdateNotification(extension) {
  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('updatedExtensionMessage', [extension.name, extension.version]),
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

  // Show the notification
  chrome.notifications.create(extension.id, options, function(){});
}

function showEnabledNotification(extension) {
  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('updatedExtensionTitle', [extension.name]),
    message: chrome.i18n.getMessage('enabledExtensionMessage', [extension.name]),
    iconUrl : getExtensionIconUrl(extension.id)
  };

  // Show the notification
  chrome.notifications.create(extension.id, options, function(){});
}


// Clear notifications on Click
chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.notifications.clear(notificationId, function(){});
});

function setEnabledExtension(extensionId) {
  chrome.management.setEnabled(extensionId, true, function() {
    chrome.management.get(extensionId, function(extension) {
      showEnabledNotification(extension);
    });
  });
}

// Handle notifications actions on button Click
chrome.notifications.onButtonClicked.addListener(function(extensionId, buttonIndex) {
  chrome.management.get(extensionId, function(extension) {
    if (extension.homepageUrl) {
      if (buttonIndex === 0) {
        chrome.tabs.create({ 'url': extension.homepageUrl });
      } else if (buttonIndex === 1) {
        if (extension.enabled) {
          chrome.tabs.create({ 'url': chrome.extension.getURL('changelog.html') + '#' + extensionId });
        } else {
          setEnabledExtension(extensionId);
        }
      }
    } else {
      setEnabledExtension(extensionId);
    }
  });
});

// Display a Welcome notification
if (!localStorage._hasDisplayedWelcomeMessage) {
  var options = {
    templateType : 'basic',
    title: chrome.i18n.getMessage('welcomeTitle'),
    message: chrome.i18n.getMessage('welcomeText'),
    iconUrl : getExtensionIconUrl()
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
