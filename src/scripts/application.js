var $ = require('jquery');

function startTimerHandler() {
  var $timer = $(this);
  
  chrome.runtime.sendMessage('start', function() {
    $timer.prop('disabled', true);
    var currentWindow = chrome.app.window.current();
    currentWindow.minimize();
  });
}

function stopTimerHandler(message) {
  if (message == 'stop') {
    $('#timer').prop('disabled', false);
    var currentWindow = chrome.app.window.current();
    currentWindow.drawAttention();
    setTimeout(currentWindow.clearAttention, 8 * 1000);
  }
}

function initialize() {
  $('#timer').on('click', startTimerHandler);

  chrome.runtime.onMessage.addListener(stopTimerHandler);
}

$(document).ready(initialize);