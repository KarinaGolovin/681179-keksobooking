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
  var MIN_ACTIVE_MAP_X = 0;
  var MIN_ACTIVE_MAP_Y = 130;
  var MAIN_PIN_X_START = 570;
  var MAIN_PIN_Y_START = 375;
  var MAIN_PIN_WIDTH_START = 40;
  var MAIN_PIN_HEIGHT_START = 44;
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_MARGIN = MAIN_PIN_WIDTH * 0.3;
  var MAIN_PIN_HEIGHT = 84;

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
  var limitValue = window.usefulUtilities.limitValue;
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
    if (!element.classList.contains('map__pin--main')) {
      element.classList.add('hidden');
    }
  });

  // First oppening of the page, reaction on main pin move
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
  };

  mainPin.addEventListener('mousedown', function (event) {
    if (event.keyCode === KEY_CODES.enter) {
      activatePage();
    }
  });

  mainPin.addEventListener('mousedown', function () {
    activatePage();
  });

  // Room capacity Validity check
  var roomCount = document.querySelector('#room_number');
  var questCapacity = document.querySelector('#capacity');

  var roomDependencies = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['2', '3'],
    '100': ['0']
  };

  roomCount.addEventListener('change', function (event) {
    var value = event.target.value;
    var availableOptions = roomDependencies[value];
    lockUnavailableOptions(questCapacity, availableOptions, value);
  });

  var lockUnavailableOptions = function (selectElement, availableOptions, value) {
    var options = selectElement.childNodes;
    if (!value) {
      options.forEach(function (option) {
        option.disabled = false;
      });
      selectElement.value = '';

      return;
    }

    if (availableOptions.indexOf(selectElement.value) === -1) {
      selectElement.value = '';
    }
    options.forEach(function (option) {
      if (option.value && availableOptions.indexOf(option.value) === -1) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  };

  // Price check
  var mapTypeToPrice = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var priceInput = document.querySelector('#price');
  document.querySelector('#type').addEventListener('change', function (event) {
    var minPrice = mapTypeToPrice[event.target.value];
    priceInput.setAttribute('placeholder', minPrice);
    priceInput.setAttribute('min', minPrice);
  });

  // Time check
  var timeoutInput = document.querySelector('#timeout');
  var timeinInput = document.querySelector('#timein');
  timeinInput.addEventListener('change', function (event) {
    var time = event.target.value;
    timeoutInput.setAttribute('placeholder', time);
    timeoutInput.value = time;
  });

  // Time input custom validity
  timeoutInput.addEventListener('input', function () {
    if (timeoutInput.value !== timeinInput.value) {
      timeoutInput.setCustomValidity('Время выезда должно совпадать со временем заезда.');
    } else {
      timeoutInput.setCustomValidity('');
    }
  });

  // ------------main_pin drag-n-drop------------


  mainPin.addEventListener('mousedown', function (event) {
    var mapContainerWidth = mapBlock.clientWidth;

    var startPosition = {
      clientX: event.clientX,
      clientY: event.clientY,
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop
    };

    var movePin = function (moveEvt) {
      var deltaX = startPosition.clientX - moveEvt.clientX;
      var deltaY = startPosition.clientY - moveEvt.clientY;

      var pinX = (startPosition.x - deltaX);
      var pinY = (startPosition.y - deltaY);

      mainPin.style.left = limitValue(pinX, MIN_ACTIVE_MAP_X + MAIN_PIN_MARGIN, mapContainerWidth - (MAIN_PIN_WIDTH + MAIN_PIN_MARGIN)) + 'px';
      mainPin.style.top = limitValue(pinY, MIN_ACTIVE_MAP_Y, MAP_HEIGHT) + 'px';
    };

    var stopPin = function () {
      var pinX = mainPin.offsetLeft + MAIN_PIN_WIDTH / 2;
      var pinY = mainPin.offsetTop + MAIN_PIN_HEIGHT;

      addressInput.value = pinX + ', ' + pinY;
      document.removeEventListener('mousemove', movePin);
      document.removeEventListener('mouseup', stopPin);
    };

    document.addEventListener('mousemove', movePin);
    document.addEventListener('mouseup', stopPin);
  });
})();
