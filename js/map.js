'use strict';
var mapBlock = document.querySelector('.map');
// place to put generated ad templates via  DocumentFragment
var mapPinsBlock = mapBlock.querySelector('.map__pins');
// place to put generated pin template
var mapPin = mapPinsBlock.querySelector('.map__pin');
// ad card template
var cardTemplate = document.querySelector('#card');
// ad pin template
var pinTemplate = cardTemplate.querySelector('.map__card');
// var randomAdList = [];

// make it visible
mapBlock.classList.remove('.map--faded');

var PLACES_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var AD_TYTLE = ['Огромный прекрасный дворец',
                'Большая уютная квартира',
                'Маленькая неуютная квартира',
                'Маленький ужасный дворец',
                'Красивый гостевой домик',
                'Некрасивый негостеприимный домик',
                'Уютное бунгало далеко от моря',
                'Неуютное бунгало по колено в воде'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['parking', 'elevator', 'conditioner', 'wifi', 'dishwasher', 'parking', 'washer'];

var randomUser = {
  author: {
    getAvatar : 'img/avatars/user0' + usefulUtilities.getRandomNumber(1, 8) + '.png'
  },
  // author: {
  //   getAvatar : function(userCount) {
  //     if (userCount > 9) {
  //       return 'img/avatars/user' + userCount[i] + '.png'
  //     } else {
  //    return 'img/avatars/user0' + userCount[i] + '.png'
  //    }
  //  }
  offer : {
    title : AD_TYTLE[usefulUtilities.getRandomNumber(0, AD_TYTLE.length - 1)],
    address : this.location.x + ', ' + this.location.y,
    price : usefulUtilities.getRandomNumber(1000, 1000000),
    type : PLACES_TYPE[usefulUtilities.getRandomNumber(0, PLACES_TYPE.length - 1)],
    rooms : usefulUtilities.getRandomNumber(1, 5),
    guests : usefulUtilities.getRandomNumber(1, 20),
    checkin : TIME[usefulUtilities.getRandomNumber(0, TIME.length - 1)],
    checkout : TIME[usefulUtilities.getRandomNumber(0, TIME.length - 1)],
    features : [],
    description : '',
    photos : ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  },
  location: {
    x : (usefulUtilities.getRandomNumber(0, 1200) - (156 / 2)),
    y : (usefulUtilities.getRandomNumber(130, 630) - 156)
  }
}

// find template options
var templateTitle = cardTemplate.querySelector('.popup__title');
var templateAddress = cardTemplate.querySelector('.popup__text--address');
var templatePrice = cardTemplate.querySelector('.popup__text--price');
var templateType = cardTemplate.querySelector('.popup__type');
var templateCapacity = cardTemplate.querySelector('.popup__text--capacity');
var templateTime = cardTemplate.querySelector('.popup__text--time');
var templateFeatures = cardTemplate.querySelector('.popup__features');
var templateDescription = cardTemplate.querySelector('.popup__description');
var templatePhotos = cardTemplate.querySelector('.popup__photos');
var templateAvatar = cardTemplate.querySelector('.popup__avatar');

// render random user
var renderUser = function (user) {
  templateTitle.textContent = user.offer.title;
  templateAddress.textContent = user.offer.address;
  templatePrice.textContent = user.offer.price  + '₽/ночь';
  templateType.textContent = user.offer.type;
  templateCapacity.textContent = user.offer.rooms + ' комнаты для ' + user.offer.guests + ' гостей';
  templateTime.textContent = 'Заезд после ' + user.offer.checkin + 'выезд до ' + user.offer.checkout;
  templateFeatures = user.offer.features;
  templateDescription.textContent = user.offer.description;
  templatePhotos.src = user.offer.photos;
  templateAvatar.src = user.offer.getAvatar();

  if (user.offer.rooms === 1 || user.offer.guests === 1) {
    templateCapacity.textContent = user.offer.rooms + ' комната для ' + user.offer.guests + ' гостя';
  } else if (user.offer.rooms === 1) {
    templateCapacity.textContent = user.offer.rooms + ' комната для ' + user.offer.guests + ' гостей';
  } else if (user.offer.guests === 1) {
    templateCapacity.textContent = user.offer.rooms + ' комнат для ' + user.offer.guests + ' гостя';
  }
};

// var randerUserPin = function (user) {
//   var userCard = cardTemplate.content.cloneNode(true);
//   userCard.style = 'left: ' + user.location.x + 'px; top: ' + user.location.y + 'px;'
//   userCard.src = user.author.avatar;
//   userCard.alt = user.offer.title;

//   return userCard;
// }

// create fragment to hold all users before append to mapBlock
var fragment = document.createDocumentFragment();

for (var i = 0; i < 8; i++) {
  // var randomUser = createRandomUser();
  var generatedUser = renderUser(randomUser);
  fragment.appendChild(generatedUser);
}

mapPinsBlock.appendChild(fragment);
