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
      closePopupById(activePopupId);
      togglePopupById(popupId, false);
    }

    if (typeof onOpen === 'function') {
      onOpen(popupId);
    }

    activePopupId = popupId;
  };

  var closePopupById = function (popupId) {
    if (!activePopupId) {
      return;
    }
    activePopupId = null;
    togglePopupById(popupId, true);

    if (typeof onClose === 'function') {
      onClose(popupId);
    }
  };

  // Add on click functional, listen [X] button event
  var handlePopupCloseClick = function () {
    closePopupById(activePopupId);
  };

  document.addEventListener('keydown', function (event) {
    if (event.keyCode === KEY_CODES.esc) {
      closePopupById(activePopupId);
    }
  });

  document.querySelectorAll('.popup__close').forEach(function (element) {
    element.addEventListener('click', handlePopupCloseClick);
  });

  return {
    openPopupById: openPopupById,
    closePopupById: closePopupById
  };
};
