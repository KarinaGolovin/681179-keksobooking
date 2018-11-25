'use strict';

(function () {
  var NUMBER_OF_USERS = 8;
  var OFFER_TYPES = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var PIN_SIZE_X = 50;
  var PIN_SIZE_Y = 70;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 630;

  var mapBlock = document.querySelector('.map');
  // place to put generated ad templates via  DocumentFragment
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  // place to put generated pin template
  var mapPinTemplate = document.querySelector('#pin');
  // ad card template
  var cardTemplate = document.querySelector('#card');
  // make it visible
  mapBlock.classList.remove('map--faded');

  var getWordend = window.usefulUtilities.getWordend;
  var getRandomUserData = window.userDataGenerator.getRandomUserData;

  // Render appartament photos
  var renderPhotos = function (template, photosList) {
    var templatePhoto = template.querySelector('.popup__photo');

    templatePhoto.src = photosList[0];

    for (var i = 1; i < photosList.length; i++) {
      var clone = templatePhoto.cloneNode(true);
      clone.src = photosList[i];
      template.appendChild(clone);
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
  var renderFeatures = function (template, featuresList) {
    template.innerHTML = '';

    for (var j = 0; j < featuresList.length; j++) {
      var featureEl = document.createElement('li');
      featureEl.classList.add('popup__feature', 'popup__feature--' + featuresList[j]);
      template.appendChild(featureEl);
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

  // Add on cklick functional for pin(popup open)
  var addEventListeners = function () {
    var pins = document.querySelectorAll('.map__pin');
    var currentActivePopup = null;

    var handleMapPinClick = function (event) {
      var popupId = event.currentTarget.getAttribute('data-id');

      if (!popupId) {
        return currentActivePopup;
      }

      var popup = document.querySelector('.map__card[data-id="' + popupId + '"]');

      if (!popup || popup === currentActivePopup) {
        return currentActivePopup;
      }

      if (currentActivePopup) {
        currentActivePopup.classList.add('hidden');
        currentActivePopup = null;
      }
      popup.classList.remove('hidden');

      return popup;
    };

    // Add on cklick functional, listen [X] button event
    var handlePopupCloseClick = function (event) {
      event.currentTarget.closest('.popup').classList.add('hidden');
      var activePin = document.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
      currentActivePopup = null;
    };

    pins.forEach(function (element) {
      element.addEventListener('click', function (event) {
        currentActivePopup = handleMapPinClick(event);
        if (!element.classList.contains('map__pin--main')) {
          var activePin = document.querySelector('.map__pin--active');
          if (activePin && element !== activePin) {
            activePin.classList.remove('map__pin--active');
          }
          element.classList.add('map__pin--active');
        }
      });
    });

    document.querySelectorAll('.popup__close').forEach(function (element) {
      currentActivePopup = null;
      element.addEventListener('click', handlePopupCloseClick);
    });
  };

  // Create array of users
  var getUsers = function (count) {
    var users = [];
    var config = {
      locationXFrom: PIN_SIZE_X / 2,
      locationXTo: MAP_WIDTH - PIN_SIZE_X / 2,
      locationYFrom: 150,
      locationYTo: MAP_HEIGHT - PIN_SIZE_Y
    };

    for (var i = 0; i <= count - 1; i++) {
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
})();
