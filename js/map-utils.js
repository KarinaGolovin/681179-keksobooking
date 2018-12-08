'use strict';

window.mapUtils = (function () {
  var createDraggablePin = function (config) {
    var element = config.element;
    var onDragStop = config.onDragStop;
    var onDragStart = config.onDragStart;
    var onDragMove = config.onDragMove;

    // Main_pin drag-n-drop
    element.addEventListener('mousedown', function (event) {
      var startPosition = {
        clientX: event.clientX,
        clientY: event.clientY,
        x: element.offsetLeft,
        y: element.offsetTop
      };

      if (typeof onDragStart === 'function') {
        onDragStart(startPosition.clientX, startPosition.clientY);
      }

      var movePin = function (moveEvt) {
        var deltaX = startPosition.clientX - moveEvt.clientX;
        var deltaY = startPosition.clientY - moveEvt.clientY;

        var pinX = startPosition.x - deltaX;
        var pinY = startPosition.y - deltaY;

        if (typeof onDragMove === 'function') {
          onDragMove(pinX, pinY);
        }
      };

      var stopPin = function () {
        var pinX = element.offsetLeft;
        var pinY = element.offsetTop;

        if (typeof onDragStop === 'function') {
          onDragStop(pinX, pinY);
        }

        document.removeEventListener('mousemove', movePin);
        document.removeEventListener('mouseup', stopPin);
      };

      document.addEventListener('mousemove', movePin);
      document.addEventListener('mouseup', stopPin);
    });
  };

  return {
    createDraggablePin: createDraggablePin
  };
})();
