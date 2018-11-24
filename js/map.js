'use strict';
var mapBlock = document.querySelector('.map');
// place to put generated ad templates via  DocumentFragment
var mapPinsBlock = mapBlock.querySelector('.map__pins');
// place to put generated pin template
var mapPinTemplate = document.querySelector('#pin');
// ad card template
var cardTemplate = document.querySelector('#card');

// make it visible
mapBlock.classList.remove('map--faded');

var PIN_SIZE_X = 50;
var PIN_SIZE_Y = 70;
var NUMBER_OF_USERS = 8;
var PLACES_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var AD_TYTLE = [
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
var MAP_WIDTH = 1200;
var MAP_HEIGHT = 630;

var getRandomNumber = window.usefulUtilities.getRandomNumber;
var shuffleArray = window.usefulUtilities.shuffleArray;
var getRandomArrayValue = window.usefulUtilities.getRandomArrayValue;

// create random array with random length
var getRandomSlice = function (arr) {
  var randomLength = getRandomNumber(0, arr.length - 1);

  return shuffleArray(arr).slice(0, Math.max(randomLength, 1));
};

var avatarInxes = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]);
var getRandomAvatar = function () {
  return 'img/avatars/user0' + avatarInxes.pop() + '.png';
};

var getRandomUserData = function () {
  var user = {
    author: {
      avatar: getRandomAvatar()
    },
    offer: {
      title: getRandomArrayValue(AD_TYTLE),
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
    }
  };

  return user;
};

var renderPhotos = function (template, photosList) {
  var templatePhotosContainer = template.querySelector('.popup__photos');
  var templatePhoto = templatePhotosContainer.querySelector('.popup__photo');
  var photosContainer = templatePhotosContainer.cloneNode();

  for (var i = 0; i < photosList.length; i++) {
    templatePhoto.src = photosList[i];
    photosContainer.appendChild(templatePhoto.cloneNode(true));
  }

  templatePhotosContainer.parentElement.replaceChild(photosContainer, templatePhotosContainer);
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

var rendereFeatures = function (template, featuresList) {
  var templateFeaturesContainer = template.querySelector('.popup__features');

  var featuresContainer = templateFeaturesContainer.cloneNode();
  for (var j = 0; j < featuresList.length; j++) {
    featuresContainer.appendChild(
        template.querySelector('.popup__feature--' + featuresList[j]).cloneNode(true)
    );
  }

  templateFeaturesContainer.parentElement.replaceChild(featuresContainer, templateFeaturesContainer);
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
  var templateAvatar = cardTemplate.content.querySelector('.popup__avatar');
  var templateType = clone.querySelector('.popup__type');

  templateTitle.textContent = user.offer.title;
  templateAddress.textContent = user.offer.address();
  templatePrice.textContent = user.offer.price + '₽/ночь';
  templateCapacity.textContent = user.offer.rooms + ' ' + window.usefulUtilities.getWordend(user.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + user.offer.guests + ' ' + window.usefulUtilities.getWordend(user.offer.guests, ['гостя', 'гостей', 'гостей']);
  templateTime.textContent = 'Заезд после ' + user.offer.checkin + ' выезд до ' + user.offer.checkout;
  templateDescription.textContent = user.offer.description;

  rendereFeatures(clone, user.offer.features);
  renderPhotos(clone, user.offer.photos);

  var offerTypes = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  templateType.textContent = offerTypes[user.offer.type];
  templateAvatar.src = user.author.avatar;

  return clone;
};

var render = function () {
  // create fragment to hold all users before append to mapPinsBlock
  var fragment = document.createDocumentFragment();

  for (var i = 1; i <= NUMBER_OF_USERS; i++) {
    var user = getRandomUserData(i);
    var generatedUser = renderUser(user);
    var generatedPin = renderUserPin(user);

    fragment.appendChild(generatedUser);
    fragment.appendChild(generatedPin);
  }

  mapPinsBlock.appendChild(fragment);
};

render();
