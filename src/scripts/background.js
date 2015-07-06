chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    id: 'main',
    outerBounds: {
      width: 400,
      height: 300
    }
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message == 'start') {
    chrome.alarms.create('timer', { delayInMinutes: 25 });
    sendResponse();
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  chrome.runtime.sendMessage('stop');
});