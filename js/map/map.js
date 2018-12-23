'use strict';

(function () {
  window.keks = window.keks || {};
  window.keks.map = window.keks.map || {};

  window.keks.map.map = function (config) {
    var OFFER_TYPES = {
      'flat': 'Квартира',
      'palace': 'Дворец',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    };
    var KEY_CODES = window.keks.constants.KEY_CODES;
    var PIN_SIZE_X = 50;
    var PIN_SIZE_Y = 70;
    var DEBOUNCE = 500;
    var MAX_ADS = 5;

    var main = document.querySelector('main');
    var mapBlock = document.querySelector('.map');
    var mapPinsBlock = mapBlock.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin');
    var cardTemplate = document.querySelector('#card');
    var errorPopupTemplate = document.querySelector('#error');

    var getWordend = window.keks.utilities.getWordend;
    var defaultFunctionParam = window.keks.utilities.defaultFunctionParam;

    var onPageActivate = defaultFunctionParam(config.onPageActivate);
    var onPageReset = defaultFunctionParam(config.onPageReset);
    var onLocationChange = defaultFunctionParam(config.onLocationChange);

    // Render apartment photos
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

    // Render apartment features
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

      var handleKeyPress = function (evt) {
        if (evt.keyCode === KEY_CODES.esc) {
          closeErrorMessage();
        }
      };

      var closeErrorMessageOnOutClick = function (evt) {
        evt.preventDefault();
        if (!evt.target.classList.contains('error__message')) {
          closeErrorMessage();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      errorBlock.addEventListener('click', closeErrorMessageOnOutClick);
    };

    var activeAds = null;
    var onLoadFunction = function (usersList) {
      activeAds = usersList;
      renderAds(usersList);

      filters.enableFilters();
    };

    var fetchAds = function () {
      window.keks.backend.load(onLoadFunction, onErrorFunction);
    };

    // First opening of the page
    var activatePage = function () {
      if (mapBlock.classList.contains('map--active')) {
        return;
      }

      fetchAds();

      mapBlock.classList.remove('map--faded');
      mapBlock.classList.add('map--active');

      onPageActivate();
    };

    var resetPage = function () {
      var mapCards = document.querySelectorAll('.map__card');

      mapBlock.classList.add('map--faded');
      mapBlock.classList.remove('map--active');

      mapCards.forEach(function (element) {
        if (!element.classList.contains('hidden')) {
          element.classList.add('hidden');
        }
      });

      filters.disableFilters();
      onPageReset();
    };

    var addressSelector = window.keks.map.addressSelector({
      containerWidth: mapBlock.clientWidth,
      onActivate: activatePage,
      onLocationChange: onLocationChange
    });

    var pins = window.keks.map.pins();

    var removeElement = function (element) {
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
      }
    };

    var renderAds = function (usersList) {
      clearAds();
      renderUserCards(filters.applyFilters(usersList).slice(0, MAX_ADS));
      pins.init();
    };

    var clearAds = function () {
      pins.destroy();
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(removeElement);
      document.querySelectorAll('.map__card').forEach(removeElement);
    };

    var filters = window.keks.map.filters({
      onFiltersChange: window.keks.utilities.debounce(function () {
        if (activeAds !== null) {
          renderAds(activeAds);
        }
      }, DEBOUNCE, true)
    });

    return {
      addressSelector: addressSelector,
      filters: filters,
      resetPage: resetPage
    };
  };
})();
