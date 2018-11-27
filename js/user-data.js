'use strict';

window.userDataGenerator = (function () {
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

  var getRandomNumber = window.usefulUtilities.getRandomNumber;
  var shuffleArray = window.usefulUtilities.shuffleArray;
  var getRandomArrayValue = window.usefulUtilities.getRandomArrayValue;
  var generateSequence = window.usefulUtilities.generateSequence;

  // create random array with random length
  var getRandomSlice = function (arr) {
    var randomLength = getRandomNumber(0, arr.length - 1);

    return shuffleArray(arr).slice(0, Math.max(randomLength, 1));
  };

  // create random unrepeatable avatar
  var arrayFromNumber = null;
  var avatarIndexs = null;
  var getRandomAvatar = function () {
    return 'img/avatars/user0' + avatarIndexs.pop() + '.png';
  };

  // Random user data generator
  var getRandomUserData = function (config) {
    if (arrayFromNumber === null) {
      arrayFromNumber = generateSequence(config.numberOfUsers);
      avatarIndexs = shuffleArray(arrayFromNumber);
    }

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
        x: getRandomNumber(config.locationXFrom, config.locationXTo),
        y: getRandomNumber(config.locationYFrom, config.locationYTo)
      },
      // used to open/close popups
      getUserId: function () {
        return user.location.x + '_' + user.location.y;
      }
    };

    return user;
  };

  return {
    getRandomUserData: getRandomUserData
  };
})();
