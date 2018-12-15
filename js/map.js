'use strict';

(function () {
  var OFFER_TYPES = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var KEY_CODES = window.constants.KEY_CODES;

  var PIN_SIZE_X = 50;
  var PIN_SIZE_Y = 70;

  var main = document.querySelector('main');
  var mapBlock = document.querySelector('.map');
  var mapPinsBlock = mapBlock.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin');
  var cardTemplate = document.querySelector('#card');
  var errorPopupTemplate = document.querySelector('#error');

  var getWordend = window.usefulUtilities.getWordend;

  // Render appartament photos
  var renderPhotos = function (element, photosList) {
    var photo = element.querySelector('.popup__photo');
    var template = photo.cloneNode();

    element.removeChild(photo);

    for (var i = 0; i < photosList.length; i++) {
      var clone = template.cloneNode(true);
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
    templateAddress.textContent = offer.address;
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

  //  Write rendered user cards in DOM
  var renderUserCards = function (usersList) {
    var fragment = document.createDocumentFragment();

    usersList.forEach(function (user) {
      if (!user.offer) {
        return;
      }

      var userId = user.location.x + '_' + user.location.y;
      var generatedUser = renderUser(user);
      var generatedPin = renderUserPin(user);

      generatedUser.querySelector('.map__card').setAttribute('data-id', userId);
      generatedPin.querySelector('.map__pin').setAttribute('data-id', userId);

      fragment.appendChild(generatedUser);
      fragment.appendChild(generatedPin);
    });

    mapPinsBlock.appendChild(fragment);
  };

  var onErrorFunction = function (message) {
    var cloneErrorTemplate = errorPopupTemplate.content.cloneNode(true);
    var errorMessage = cloneErrorTemplate.querySelector('.error__message');
    errorMessage.textContent = message;
    var errorBlock = cloneErrorTemplate.querySelector('.error');

    main.appendChild(cloneErrorTemplate);

    var closeErrorMessage = function () {
      document.removeEventListener('keydown', handleKeyPress);
      errorBlock.removeEventListener('click', closeErrorMessageOnOutClick);
      main.removeChild(errorBlock);

      resetPage();
    };

    var handleKeyPress = function (event) {
      if (event.keyCode === KEY_CODES.esc) {
        closeErrorMessage();
      }
    };

    var closeErrorMessageOnOutClick = function (event) {
      event.preventDefault();
      if (!event.target.classList.contains('error__message')) {
        closeErrorMessage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    errorBlock.addEventListener('click', closeErrorMessageOnOutClick);
  };


  // First oppening of the page, reaction on main pin move
  var activatePage = function () {
    if (mapBlock.classList.contains('map--active')) {
      return;
    }

    window.backend.load(function (usersList) {
      renderUserCards(usersList);
      window.initMapPins();
    }, onErrorFunction);

    mapBlock.classList.remove('map--faded');
    mapBlock.classList.add('map--active');

    window.keksForm.onPageActivate();
  };

  var resetPage = function () {
    mapBlock.classList.add('map--faded');
    mapBlock.classList.remove('map--active');

    window.keksForm.handlePageReset();
  };

  var init = function () {
    window.keksForm.init({
      onFormActivate: activatePage
    });
  };

  init();
})();
