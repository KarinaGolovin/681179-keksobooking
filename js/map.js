'use strict';

(function () {
  var PIN_SIZE_X = 50;
  var PIN_SIZE_Y = 70;
  var NUMBER_OF_USERS = 8;
  var PLACES_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var AD_TITLE = [
    'Огромный прекрасный дворец',
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['elevator', 'conditioner', 'wifi', 'dishwasher', 'parking', 'washer'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var OFFER_TYPES = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
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

  var getRandomNumber = window.usefulUtilities.getRandomNumber;
  var shuffleArray = window.usefulUtilities.shuffleArray;
  var getRandomArrayValue = window.usefulUtilities.getRandomArrayValue;
  var getWordend = window.usefulUtilities.getWordend;

  // create random array with random length
  var getRandomSlice = function (arr) {
    var randomLength = getRandomNumber(0, arr.length - 1);

    return shuffleArray(arr).slice(0, Math.max(randomLength, 1));
  };

  var avatarIndexs = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]);
  var getRandomAvatar = function () {
    return 'img/avatars/user0' + avatarIndexs.pop() + '.png';
  };

  var getRandomUserData = function () {
    var user = {
      author: {
        avatar: getRandomAvatar()
      },
      offer: {
        title: getRandomArrayValue(AD_TITLE),
        address: function () {
          return user.location.x + ', ' + user.location.y;
        },
        price: getRandomNumber(1000, 1000000),
        type: getRandomArrayValue(PLACES_TYPE),
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 20),
        checkin: getRandomArrayValue(TIME),
        checkout: getRandomArrayValue(TIME),
        features: getRandomSlice(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS),
      },
      location: {
        x: getRandomNumber(PIN_SIZE_X / 2, MAP_WIDTH - PIN_SIZE_X / 2),
        y: getRandomNumber(150, MAP_HEIGHT - PIN_SIZE_Y)
      },
      // used to open/close popups
      getUserId: function () {
        return user.location.x + '_' + user.location.y;
      }
    };

    return user;
  };

  var renderPhotos = function (template, photosList) {
    var templatePhoto = template.querySelector('.popup__photo');

    templatePhoto.src = photosList[0];

    for (var i = 1; i < photosList.length; i++) {
      var clone = templatePhoto.cloneNode(true);
      clone.src = photosList[i];
      template.appendChild(clone);
    }
  };

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

  var renderFeatures = function (template, featuresList) {
    var clone = template.cloneNode();

    for (var j = 0; j < featuresList.length; j++) {
      clone.appendChild(
          template.querySelector('.popup__feature--' + featuresList[j]).cloneNode(true)
      );
    }

    template.parentElement.replaceChild(clone, template);
  };

  var renderUser = function (user) {
    var clone = cardTemplate.content.cloneNode(true);
    // template links
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

  // On cklick
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

    var handlePopupCloseClick = function (event) {
      event.currentTarget.closest('.popup').classList.add('hidden');
      // remove pin class
      var activePin = document.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
      currentActivePopup = null;
    };

    pins.forEach(function (element) {
      element.addEventListener('click', function (event) {
        currentActivePopup = handleMapPinClick(event);
        // check is it main pin
        if (!element.classList.contains('map__pin--main')) {
          // remove active pin class/check if it active
          var activePin = document.querySelector('.map__pin--active');
          if (activePin && element !== activePin) {
            activePin.classList.remove('map__pin--active');
          }
          element.classList.add('map__pin--active');
        }
      });
    });

    // Listen close [X] button event
    document.querySelectorAll('.popup__close').forEach(function (element) {
      currentActivePopup = null;
      element.addEventListener('click', handlePopupCloseClick);
    });
  };

  var getUsers = function (count) {
    var users = [];
    for (var i = 0; i <= count - 1; i++) {
      users.push(getRandomUserData());
    }

    return users;
  };

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

