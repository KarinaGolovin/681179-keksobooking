'use strict';

var KEY_CODES = window.constants.KEY_CODES;

window.initMapPopup = function (config) {
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

  document.addEventListener('keydown', function (event) {
    if (event.keyCode === KEY_CODES.esc) {
      closePopup();
    }
  });

  document.querySelectorAll('.popup__close').forEach(function (element) {
    element.addEventListener('click', handlePopupCloseClick);
  });

  return {
    openPopupById: openPopupById,
    closePopup: closePopup
  };
};
