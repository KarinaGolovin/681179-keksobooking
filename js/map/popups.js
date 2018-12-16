'use strict';

(function () {
  var KEY_CODES = window.constants.KEY_CODES;

  window.keksMapPopup = function (config) {
    var onClose = config.onClose;
    var onOpen = config.onOpen;
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

      if (typeof onOpen === 'function') {
        onOpen(popupId);
      }

      activePopupId = popupId;
    };

    var closePopup = function () {
      if (!activePopupId) {
        return;
      }

      togglePopupById(activePopupId, true);
      activePopupId = null;

      if (typeof onClose === 'function') {
        onClose();
      }
    };

    // Add on click functional, listen [X] button event
    var handlePopupCloseClick = function () {
      closePopup();
    };

    var handleKeyDown = function (event) {
      if (event.keyCode === KEY_CODES.esc) {
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
