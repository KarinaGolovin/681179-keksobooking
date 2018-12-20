'use strict';

(function () {
  window.keks = window.keks || {};
  window.keks.map = window.keks.map || {};

  var defaultFunctionParam = window.keks.utilities.defaultFunctionParam;

  var makeDraggable = function (config) {
    var element = config.element;
    var onDragStop = defaultFunctionParam(config.onDragStop);
    var onDragStart = defaultFunctionParam(config.onDragStart);
    var onDragMove = defaultFunctionParam(config.onDragMove);

    // Main_pin drag-n-drop
    element.addEventListener('mousedown', function (event) {
      var startPosition = {
        clientX: event.clientX,
        clientY: event.clientY,
        x: element.offsetLeft,
        y: element.offsetTop
      };

      onDragStart(startPosition.clientX, startPosition.clientY);

      var movePin = function (moveEvt) {
        var deltaX = startPosition.clientX - moveEvt.clientX;
        var deltaY = startPosition.clientY - moveEvt.clientY;

        var pinX = startPosition.x - deltaX;
        var pinY = startPosition.y - deltaY;

        onDragMove(pinX, pinY);
      };

      var stopPin = function () {
        var pinX = element.offsetLeft;
        var pinY = element.offsetTop;

        onDragStop(pinX, pinY);

        document.removeEventListener('mousemove', movePin);
        document.removeEventListener('mouseup', stopPin);
      };

      document.addEventListener('mousemove', movePin);
      document.addEventListener('mouseup', stopPin);
    });
  };

  window.keks.map.utils = {
    makeDraggable: makeDraggable
  };
})();
