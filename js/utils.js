'use strict';

window.usefulUtilities = {
  // get random number in the range from...to
  getRandomNumber: function (minNumber, maxNumber) {
    return Math.floor(minNumber + (Math.random() * (maxNumber + 1 - minNumber)));
  },
  // shuffle array for random picking
  shuffleArray: function (array) {
    var newArray = array.slice();
    for (var i = newArray.length - 1; i > 0; i--) {
      var number = Math.floor(Math.random() * (i + 1));
      var firstNumber = newArray[number];
      newArray[number] = newArray[i];
      newArray[i] = firstNumber;
    }
    return newArray;
  },
  // code taken from with minor modifications to pass eslint codestyle
  // https://javascript.ru/forum/misc/36941-smena-okonchaniya-pri-podschjote.html
  getWordend: function (num, words) {
    num = Math.abs(num % 100);
    var index = 1;

    if (num > 10 && num < 15 || (num %= 10) > 4 || num === 0) {
      index = 2;
    } else if (num === 1) {
      index = 0;
    }
    return words[index];
  },
  getRandomArrayValue: function (arr) {
    return arr[window.usefulUtilities.getRandomNumber(0, arr.length - 1)];
  },
  generateSequence: function (number) {
    var numbersArray = [];

    for (var i = 1; i <= number; i++) {
      numbersArray.push(i);
    }
    return numbersArray;
  },
  limitValue: function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};
