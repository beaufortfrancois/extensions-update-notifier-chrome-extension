var text = document.getElementById('text'),
    code = document.getElementById('code'),
    icon = document.getElementById('icon');

// Hash only exists for an extension update
if (window.location.hash) {
  var extension = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));

  text.innerHTML = chrome.i18n.getMessage('updatedExtensionText', [extension.name]);
  
  code.innerHTML = 
    '<div class="old">"version": "<span class="oldChanged">' + extension.oldVersion + '</span>"</div>' +
    '<div class="new">"version": "<span class="newChanged">' + extension.version + '</span>"</div>';

  if (extension.homepageUrl) {
    var link = document.getElementById('link');
    link.textContent = chrome.i18n.getMessage('extensionWebstoreLink');
    link.addEventListener('click', function() {
      chrome.tabs.create({
        'url': extension.homepageUrl
      });
    });

    var changelog = document.getElementById('changelog');
    changelog.textContent = chrome.i18n.getMessage('changelogLink');
    changelog.addEventListener('click', function(e) {
      e.stopPropagation();

      // Ask permissions first
      chrome.permissions.request({ origins: ['https://chrome.google.com/*'] }, function(granted) {
        if (granted) {
          // Open changelog
          chrome.tabs.create({
            'url': chrome.extension.getURL('changelog.html') + '#' + encodeURIComponent(JSON.stringify(extension))
          });
        }
      });
    });
  }

  if (extension.icons && extension.icons.length !== 0) {
    icon.src = extension.icons[extension.icons.length-1].url;
  } else {
    icon.src = 'chrome://extension-icon/' + extension.id + '/32/0';
  }

  // Make the icon gray if the extension is not enabled
  if (!extension.enabled && extension.installType != 'development') {
    icon.src += '?grayscale=true';

    // And add "Enable" feature
    var enable = document.getElementById('enable');
    enable.textContent = chrome.i18n.getMessage('enableText');
    enable.addEventListener('click', function() {
      chrome.management.setEnabled(''+extension.id, true);
    });
  }

} else {
  // Display Welcome Message
  text.innerHTML = chrome.i18n.getMessage('welcomeText');
  icon.src = 'chrome://extension-icon/' + chrome.app.getDetails().id + '/32/0';
  code.style.display = 'none';
  document.getElementById('actions').style.display = 'none';
  
}

// Close notification on simple click
document.addEventListener('click', function() { 
  close(); 
});
