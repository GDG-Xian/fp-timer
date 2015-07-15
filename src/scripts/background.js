chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    id: 'main',
    outerBounds: {
      width: 400,
      height: 300
    }
  });
});

var handlers = {};

handlers.start = function(msg, port) {
  chrome.alarms.create('timer', { delayInMinutes: msg.time });
  chrome.alarms.get('timer', function(alarm) {
    port.postMessage({ type: 'started', scheduledTime: alarm.scheduledTime });
  });
};

handlers.stop = function(msg, port) {
  chrome.alarms.clear('timer', function() {
    port.postMessage({ type: 'stopped', attention: false });
  });
};


chrome.runtime.onConnect.addListener(function(port) {
  if (port.name != 'fp-timer') return;

  port.onMessage.addListener(function(msg) {
    handlers[msg.type](msg, port);
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    port.postMessage({ type: 'stopped', attention: true });
  });
});

