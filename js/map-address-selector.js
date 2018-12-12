'use strict';

var MAP_HEIGHT = 630;
var MIN_ACTIVE_MAP_X = 0;
var MIN_ACTIVE_MAP_Y = 130;
var MAIN_PIN_WIDTH = 64;
var MAIN_PIN_HEIGHT = 86;
var MAIN_PIN_MARGIN = MAIN_PIN_WIDTH * 0.3;
var KEY_CODES = window.constants.KEY_CODES;
var MAIN_PIN_X_START = 570;
var MAIN_PIN_Y_START = 375;
var MAIN_PIN_WIDTH_START = 40;
var MAIN_PIN_HEIGHT_START = 44;

window.mapAddressSelector = (function () {
  var limitValue = window.usefulUtilities.limitValue;

  var defaultPositionX = MAIN_PIN_X_START + MAIN_PIN_WIDTH_START / 2;
  var defaultPositionY = MAIN_PIN_Y_START + MAIN_PIN_HEIGHT_START / 2;
  var elementInitialPositionX = null;
  var elementInitialPositionY = null;

  var locationX = defaultPositionX;
  var locationY = defaultPositionY;

  var updateLocation = function (pinX, pinY) {
    locationX = pinX + MAIN_PIN_WIDTH / 2;
    locationY = pinY + MAIN_PIN_HEIGHT;
  };

  var init = function (config) {
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
        updateLocation(pinX, pinY);
        onLocationChange(locationX, locationY);
      },
      onDragMove: function (pinX, pinY) {
        updateLocation(pinX, pinY);

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
        updateLocation(elementInitialPositionX, elementInitialPositionY);
        mainPin.style.left = elementInitialPositionX + 'px';
        mainPin.style.top = elementInitialPositionY + 'px';
        onLocationChange(locationX, locationY);
      }
    };
  };

  return {
    init: init
  };
})();
