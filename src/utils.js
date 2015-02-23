var DEFAULT_OPTIONS = {
  ALWAYS_DISABLE_EXTENSION: false,
  AUTO_CLOSE_NOTIFICATION: false,
  SHOW_CHANGELOG: true,
}

// Localize all content.                                                        
function localize() {                                                           
  var elements = document.querySelectorAll('[i18-content]');                    
  for (var element, i = 0; element = elements[i]; i++) {                        
    var messageName = element.getAttribute('i18-content');                      
    element.textContent = chrome.i18n.getMessage(messageName);                  
  }                                                                             
}            
