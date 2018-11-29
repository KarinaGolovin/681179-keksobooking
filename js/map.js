'use strict';

(function () {
  var NUMBER_OF_USERS = 8;
  var OFFER_TYPES = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var KEY_CODES = {
    enter: 13,
    esc: 27
  };

  var PIN_SIZE_X = 50;
  var PIN_SIZE_Y = 70;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 630;
  var MAIN_PIN_X_START = 570;
  var MAIN_PIN_Y_START = 375;
  var MAIN_PIN_WIDTH_START = 40;
  var MAIN_PIN_HEIGHT_START = 44;
  // // Будут использованы в следующем задании
  // var MAIN_PIN_WIDTH = 62;
  // var MAIN_PIN_HEIGHT = 84;

  var mapBlock = document.querySelector('.map');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin');
  var cardTemplate = document.querySelector('#card');
  var mainPin = mapPinsBlock.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var fieldsetList = document.querySelectorAll('fieldset');
  var mapFilterList = mapBlock.querySelectorAll('.map__filter');
  var adForm = document.querySelector('.ad-form');

  var getWordend = window.usefulUtilities.getWordend;
  var getRandomUserData = window.userDataGenerator.getRandomUserData;

  // Render appartament photos
  var renderPhotos = function (element, photosList) {
    var templatePhoto = element.querySelector('.popup__photo');

    templatePhoto.src = photosList[0];

    for (var i = 1; i < photosList.length; i++) {
      var clone = templatePhoto.cloneNode(true);
      clone.src = photosList[i];
      element.appendChild(clone);
    }
  };

  // Render user map pin
  var renderUserPin = function (user) {
    var clone = mapPinTemplate.content.cloneNode(true);
    var button = clone.querySelector('.map__pin');
    var img = clone.querySelector('img');

    button.style.left = (user.location.x - PIN_SIZE_X / 2) + 'px';
    button.style.top = (user.location.y - PIN_SIZE_Y / 2) + 'px';

    img.src = user.author.avatar;
    img.alt = user.offer.title;

    return clone;
  };

  // Render appartament features
  var renderFeatures = function (element, featuresList) {
    for (var j = 0; j < featuresList.length; j++) {
      var featureEl = document.createElement('li');
      featureEl.classList.add('popup__feature', 'popup__feature--' + featuresList[j]);
      element.appendChild(featureEl);
    }
  };

  // Render user card
  var renderUser = function (user) {
    var clone = cardTemplate.content.cloneNode(true);

    var templateTitle = clone.querySelector('.popup__title');
    var templateAddress = clone.querySelector('.popup__text--address');
    var templatePrice = clone.querySelector('.popup__text--price');
    var templateCapacity = clone.querySelector('.popup__text--capacity');
    var templateTime = clone.querySelector('.popup__text--time');
    var templateDescription = clone.querySelector('.popup__description');
    var templateAvatar = clone.querySelector('.popup__avatar');
    var templateType = clone.querySelector('.popup__type');
    var templatePhotosContainer = clone.querySelector('.popup__photos');
    var templateFeaturesContainer = clone.querySelector('.popup__features');
    var offer = user.offer;

    templateTitle.textContent = offer.title;
    templateAddress.textContent = offer.address();
    templatePrice.textContent = offer.price + '₽/ночь';
    templateCapacity.textContent = offer.rooms + ' ' + getWordend(offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + offer.guests + ' ' + getWordend(offer.guests, ['гостя', 'гостей', 'гостей']);
    templateTime.textContent = 'Заезд после ' + offer.checkin + ' выезд до ' + offer.checkout;
    templateDescription.textContent = offer.description;

    templateType.textContent = OFFER_TYPES[offer.type];
    templateAvatar.src = user.author.avatar;

    renderFeatures(templateFeaturesContainer, offer.features);
    renderPhotos(templatePhotosContainer, offer.photos);

    clone.querySelector('.map__card').classList.add('hidden');

    return clone;
  };

  // Handle popup close and open
  var addEventListeners = function () {
    var pins = document.querySelectorAll('.map__pin');
    var activePopupId = null;
    var focusedPin = null;

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

      activePopupId = popupId;
    };

    var closePopupById = function (popupId) {
      if (!activePopupId) {
        return;
      }
      activePopupId = null;
      togglePopupById(popupId, true);
    };

    var resetActivePin = function () {
      var activePin = document.querySelector('.map__pin--active');

      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    };

    // Add on click functional for pin
    var setActivePin = function (element) {
      if (element.classList.contains('map__pin--main')) {
        return;
      }
      var activePin = document.querySelector('.map__pin--active');

      if (activePin && element !== activePin) {
        activePin.classList.remove('map__pin--active');
      }

      element.classList.add('map__pin--active');
    };

    // Add on click functional, listen [X] button event
    var handlePopupCloseClick = function () {
      closePopupById(activePopupId);
      resetActivePin();
    };

    var handlePinClick = function (event) {
      var clickedPin = event.currentTarget;
      var popupId = clickedPin.getAttribute('data-id');
      openPopupById(popupId);
      setActivePin(clickedPin);
    };

    var handlePinFocus = function () {
      focusedPin = event.currentTarget;
    };

    var handlePinBlur = function () {
      focusedPin = null;
    };

    pins.forEach(function (element) {
      element.addEventListener('click', handlePinClick);
      element.addEventListener('focus', handlePinFocus);
      element.addEventListener('blur', handlePinBlur);
    });

    document.querySelectorAll('.popup__close').forEach(function (element) {
      element.addEventListener('click', handlePopupCloseClick);
    });

    document.addEventListener('keydown', function (event) {
      if (event.keyCode === KEY_CODES.esc) {
        closePopupById(activePopupId);
        resetActivePin();
      }

      if (event.keyCode === KEY_CODES.enter && focusedPin) {
        var popupId = focusedPin.getAttribute('data-id');
        openPopupById(popupId);
      }
    });
  };

  // Create array of users
  var getUsers = function (count) {
    var users = [];
    var config = {
      locationXFrom: PIN_SIZE_X / 2,
      locationXTo: MAP_WIDTH - PIN_SIZE_X / 2,
      locationYFrom: 150,
      locationYTo: MAP_HEIGHT - PIN_SIZE_Y,
      numberOfUsers: NUMBER_OF_USERS
    };

    for (var i = 0; i < count; i++) {
      users.push(getRandomUserData(config));
    }

    return users;
  };

  //  Write rendered user cards in DOM
  var render = function () {
    // create fragment to hold all users before append to mapPinsBlock
    var fragment = document.createDocumentFragment();
    var users = getUsers(NUMBER_OF_USERS);

    users.forEach(function (user) {
      var userId = user.getUserId();
      var generatedUser = renderUser(user);
      var generatedPin = renderUserPin(user);

      generatedUser.querySelector('.map__card').setAttribute('data-id', userId);
      generatedPin.querySelector('.map__pin').setAttribute('data-id', userId);

      fragment.appendChild(generatedUser);
      fragment.appendChild(generatedPin);
    });

    mapPinsBlock.appendChild(fragment);

    addEventListeners();
  };

  render();

  // --------module4-task1----------


  var pins = mapPinsBlock.querySelectorAll('button');

  addressInput.value = (MAIN_PIN_X_START + (MAIN_PIN_WIDTH_START / 2)) + ', ' + (MAIN_PIN_Y_START + (MAIN_PIN_HEIGHT_START / 2));
  adForm.classList.add('ad-form--disabled');

  fieldsetList.forEach(function (element) {
    element.disabled = true;
  });

  mapFilterList.forEach(function (element) {
    element.disabled = true;
  });

  pins.forEach(function (element) {
    if (element.classList.contains('map__pin--main')) {
      return;
    } else {
      element.classList.add('hidden');
    }
  });

  // Поведение страницы вначале, при нажатии на main pin
  var activatePage = function () {
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    fieldsetList.forEach(function (element) {
      element.disabled = false;
    });

    pins.forEach(function (element) {
      element.classList.remove('hidden');
    });

    mapFilterList.forEach(function (element) {
      element.disabled = false;
    });

    addressInput.disabled = true;
  };

  mainPin.addEventListener('keydown', function (event) {
    if (event.keyCode === KEY_CODES.enter) {
      activatePage();
    }
  });

  mainPin.addEventListener('mouseup', function () {
    activatePage();
    // Правильные данные запишу после следующей лекции,
    // когда начнем перетаскивать метку, получая атрибуты(getAttribute) с этого пина
    // пока это подсказка
    addressInput.value = 'X + MAIN_PIN_WIDTH / 2, Y + MAIN_PIN_HEIGHT';
  });
})();
