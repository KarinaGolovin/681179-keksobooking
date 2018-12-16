'use strict';

(function () {
  window.keksMapPins = function () {
    var PIN_CLASS = 'map__pin';
    var PIN_ACTIVE_CLASS = 'map__pin--active';
    var PIN_MAIN_CLASS = 'map__pin--main';
    var KEY_CODES = window.constants.KEY_CODES;

    var focusedPin = null;
    var popupInstance = window.keksMapPopup({
      onClose: function () {
        resetActivePin();
      }
    });

    var resetActivePin = function () {
      var activePin = document.querySelector('.' + PIN_ACTIVE_CLASS);

      if (activePin) {
        activePin.classList.remove(PIN_ACTIVE_CLASS);
      }
    };

    // Add on click functional for pin
    var setActivePin = function (element) {
      if (element.classList.contains(PIN_MAIN_CLASS)) {
        return;
      }
      var activePin = document.querySelector('.' + PIN_ACTIVE_CLASS);

      if (activePin && element !== activePin) {
        activePin.classList.remove(PIN_ACTIVE_CLASS);
      }

      element.classList.add(PIN_ACTIVE_CLASS);
    };

    var handlePinClick = function (event) {
      var clickedPin = event.currentTarget;
      var popupId = clickedPin.getAttribute('data-id');
      popupInstance.openPopupById(popupId);
      setActivePin(clickedPin);
    };

    var handlePinFocus = function () {
      focusedPin = event.currentTarget;
    };

    var handlePinBlur = function () {
      focusedPin = null;
    };

    var handleKeyDown = function (event) {
      if (event.keyCode === KEY_CODES.enter && focusedPin) {
        var popupId = focusedPin.getAttribute('data-id');
        popupInstance.openPopupById(popupId);
      }
    };

    return {
      init: function () {
        var pins = document.querySelectorAll('.' + PIN_CLASS);

        pins.forEach(function (element) {
          element.addEventListener('click', handlePinClick);
          element.addEventListener('focus', handlePinFocus);
          element.addEventListener('blur', handlePinBlur);
        });
        document.addEventListener('keydown', handleKeyDown);

        popupInstance.init();
      },
      destroy: function () {
        handlePinBlur();
        var pins = document.querySelectorAll('.' + PIN_CLASS);

        pins.forEach(function (element) {
          element.removeEventListener('click', handlePinClick);
          element.removeEventListener('focus', handlePinFocus);
          element.removeEventListener('blur', handlePinBlur);
        });
        document.removeEventListener('keydown', handleKeyDown);

        popupInstance.destroy();
      }
    };
  };
})();
