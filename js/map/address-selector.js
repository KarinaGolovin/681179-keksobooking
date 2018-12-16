'use strict';

(function () {
  var MAP_HEIGHT = 630;
  var MIN_ACTIVE_MAP_X = 0;
  var MIN_ACTIVE_MAP_Y = 130;
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_HEIGHT = 86;
  var MAIN_PIN_MARGIN = MAIN_PIN_WIDTH * 0.3;
  var KEY_CODES = window.constants.KEY_CODES;
  var MAIN_PIN_X_START = 570;
  var MAIN_PIN_Y_START = 375;

  window.keksMapAddressSelector = function (config) {
    var limitValue = window.keksUtilities.limitValue;

    var elementInitialPositionX = null;
    var elementInitialPositionY = null;

    var locationX = MAIN_PIN_X_START;
    var locationY = MAIN_PIN_Y_START;

    var updateLocation = function (pinX, pinY) {
      locationX = pinX;
      locationY = pinY;
    };

    var onActivate = config.onActivate;
    var onLocationChange = config.onLocationChange;
    var containerWidth = config.containerWidth;
    var mainPin = document.querySelector('.map__pin--main');

    elementInitialPositionX = mainPin.offsetLeft;
    elementInitialPositionY = mainPin.offsetTop;

    var handleKeyPress = function (event) {
      if (event.keyCode === KEY_CODES.enter) {
        onActivate(locationX, locationY);
      }
    };

    mainPin.addEventListener('focus', function () {
      mainPin.addEventListener('keydown', handleKeyPress);
    });

    mainPin.addEventListener('blur', function () {
      mainPin.removeEventListener('keydown', handleKeyPress);
    });

    mainPin.addEventListener('mousedown', function () {
      onActivate(locationX, locationY);
    });

    window.mapUtils.createDraggablePin({
      element: mainPin,
      onDragStop: function (pinX, pinY) {
        updateLocation(pinX + MAIN_PIN_WIDTH / 2, pinY + MAIN_PIN_HEIGHT);
        onLocationChange(locationX, locationY);
      },
      onDragMove: function (pinX, pinY) {
        updateLocation(pinX + MAIN_PIN_WIDTH / 2, pinY + MAIN_PIN_HEIGHT);

        mainPin.style.left = limitValue(pinX, MIN_ACTIVE_MAP_X + MAIN_PIN_MARGIN, containerWidth - (MAIN_PIN_WIDTH + MAIN_PIN_MARGIN)) + 'px';
        mainPin.style.top = limitValue(pinY, MIN_ACTIVE_MAP_Y, MAP_HEIGHT) + 'px';
      }
    });

    return {
      getLocation: function () {
        return {
          x: locationX,
          y: locationY
        };
      },
      reset: function () {
        updateLocation(elementInitialPositionX + MAIN_PIN_WIDTH / 2, elementInitialPositionY + MAIN_PIN_HEIGHT);
        mainPin.style.left = elementInitialPositionX + 'px';
        mainPin.style.top = elementInitialPositionY + 'px';
        onLocationChange(locationX, locationY);
      },
      resetToStartPosition: function () {
        mainPin.style.left = elementInitialPositionX + 'px';
        mainPin.style.top = elementInitialPositionY + 'px';
        updateLocation(MAIN_PIN_X_START, MAIN_PIN_Y_START);
        onLocationChange(MAIN_PIN_X_START, MAIN_PIN_Y_START);
      }
    };
  }
})();
