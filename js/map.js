'use strict';

(function () {
  var NUMBER_OF_USERS = 8;
  var OFFER_TYPES = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var KEY_CODES = window.constants.KEY_CODES;

  var PIN_SIZE_X = 50;
  var PIN_SIZE_Y = 70;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 630;
  var MAIN_PIN_X_START = 570;
  var MAIN_PIN_Y_START = 375;
  var MAIN_PIN_WIDTH_START = 40;
  var MAIN_PIN_HEIGHT_START = 44;
  var MIN_ACTIVE_MAP_X = 0;
  var MIN_ACTIVE_MAP_Y = 130;
  var MAIN_PIN_WIDTH = 64;
  var MAIN_PIN_HEIGHT = 86;
  var MAIN_PIN_MARGIN = MAIN_PIN_WIDTH * 0.3;

  var mapBlock = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin');
  var cardTemplate = document.querySelector('#card');
  var addressInput = document.querySelector('#address');
  var fieldsetList = document.querySelectorAll('fieldset');
  var mapFilterList = mapBlock.querySelectorAll('.map__filter');
  var adForm = document.querySelector('.ad-form');

  var mapContainerWidth = mapBlock.clientWidth;
  var limitValue = window.usefulUtilities.limitValue;
  var getWordend = window.usefulUtilities.getWordend;
  var getRandomUserData = window.userData.getRandomUserData;

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
  var renderUserInformation = function () {
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

      mapPinsBlock.appendChild(fragment);
    });
  };

  // First oppening of the page, reaction on main pin move
  var activatePage = function () {
    mapBlock.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    fieldsetList.forEach(function (element) {
      element.disabled = false;
    });

    mapBlock.classList.add('map--active');

    mapFilterList.forEach(function (element) {
      element.disabled = false;
    });
  };

  var initForm = function () {
    addressInput.value = (MAIN_PIN_X_START + (MAIN_PIN_WIDTH_START / 2)) + ', ' + (MAIN_PIN_Y_START + (MAIN_PIN_HEIGHT_START / 2));
    adForm.classList.add('ad-form--disabled');

    fieldsetList.forEach(function (element) {
      element.disabled = true;
    });

    mapFilterList.forEach(function (element) {
      element.disabled = true;
    });
  };

  var initPin = function () {
    var handleKeyPress = function (event) {
      if (event.keyCode === KEY_CODES.enter) {
        activatePage();
      }
    };

    mainPin.addEventListener('focus', function () {
      mainPin.addEventListener('keypress', handleKeyPress);
    });

    mainPin.addEventListener('blur', function () {
      mainPin.removeEventListener('keypress', handleKeyPress);
    });

    mainPin.addEventListener('mousedown', function () {
      activatePage();
    });

    window.mapUtils.createDraggablePin({
      element: mainPin,
      onDragStop: function (pinX, pinY) {
        addressInput.value = (pinX + MAIN_PIN_WIDTH / 2) + ', ' + (pinY + MAIN_PIN_HEIGHT);
      },
      onDragMove: function (pinX, pinY) {
        mainPin.style.left = limitValue(pinX, MIN_ACTIVE_MAP_X + MAIN_PIN_MARGIN, mapContainerWidth - (MAIN_PIN_WIDTH + MAIN_PIN_MARGIN)) + 'px';
        mainPin.style.top = limitValue(pinY, MIN_ACTIVE_MAP_Y, MAP_HEIGHT) + 'px';
      }
    });
  };

  var init = function () {
    renderUserInformation();
    window.initMapPins();
    initForm();
    initPin();
  };

  init();
})();
