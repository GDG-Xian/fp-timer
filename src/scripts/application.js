var angular = require('angular');
var moment  = require('moment');

// Chrome packaged app does not support pushState.
window.history.pushState = function() {};

angular
  .module('TimerApp', [])
  .controller('TimerCtrl', function($scope, $timeout) {
    $scope.options = {
      workTime: 25,
      restTime: 5
    };

    $scope.duration = null;

    var handlers = {};
    var timer = null;
    var scheduledTime = null;

    function calculateDuration() {
      $timeout.cancel(timer);

      var duration = scheduledTime - new Date().getTime();
      $scope.duration = moment.duration(duration).humanize();
      $scope.$apply();

      timer = $timeout(calculateDuration, 5000);
    }

    handlers.started = function(msg, port) {
      scheduledTime = msg.scheduledTime;
      calculateDuration();

      var currentWindow = chrome.app.window.current();
      currentWindow.minimize();
    };

    handlers.stopped = function(msg, port) {
      $timeout.cancel(timer);
      $scope.duration = null;
      scheduledTime = null;
      $scope.$apply();

      if (msg.attention) {
        var currentWindow = chrome.app.window.current();
        currentWindow.drawAttention();
        setTimeout(currentWindow.clearAttention, 30 * 1000);
      }
    };

    var port = chrome.runtime.connect({ name: "fp-timer" });
    port.onMessage.addListener(function(msg) {
      handlers[msg.type](msg, port);
    });

    $scope.startTimer = function() {
      var time = parseInt($scope.options.workTime);
      port.postMessage({ type: 'start', time: time });
    };

    $scope.stopTimer = function() {
      port.postMessage({ type: 'stop' });
    };
  });
