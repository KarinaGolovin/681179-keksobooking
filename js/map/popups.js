'use strict';

(function () {
  var KEY_CODES = window.keks.constants.KEY_CODES;
  var defaultFunctionParam = window.keks.utilities.defaultFunctionParam;

  window.keks = window.keks || {};
  window.keks.map = window.keks.map || {};

  window.keks.map.popup = function (config) {
    var onClose = defaultFunctionParam(config.onClose);
    var onOpen = defaultFunctionParam(config.onOpen);
    var activePopupId = null;

    var togglePopupById = function (popupId, isHidden) {
      var popup = document.querySelector('.map__card[data-id="' + popupId + '"]');

      if (!popup) {
        return;
      }

      popup.classList.toggle('hidden', isHidden);
    };

    var openPopupById = function (popupId) {
      if (popupId !== activePopupId) {
        closePopup();
        togglePopupById(popupId, false);
      }

      onOpen(popupId);

      activePopupId = popupId;
    };

    var closePopup = function () {
      if (!activePopupId) {
        return;
      }

      togglePopupById(activePopupId, true);
      activePopupId = null;

      onClose();
    };

    // Add on click functional, listen [X] button event
    var handlePopupCloseClick = function () {
      closePopup();
    };

    var handleKeyDown = function (evt) {
      if (evt.keyCode === KEY_CODES.esc) {
        closePopup();
      }
    };

    return {
      init: function () {
        document.addEventListener('keydown', handleKeyDown);

        document.querySelectorAll('.popup__close').forEach(function (element) {
          element.addEventListener('click', handlePopupCloseClick);
        });
      },
      destroy: function () {
        closePopup();
        document.removeEventListener('keydown', handleKeyDown);

        document.querySelectorAll('.popup__close').forEach(function (element) {
          element.removeEventListener('click', handlePopupCloseClick);
        });
      },
      openPopupById: openPopupById,
      closePopup: closePopup
    };
  };
})();
