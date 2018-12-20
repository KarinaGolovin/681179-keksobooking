'use strict';

(function () {
  window.keksUtilities = {
    getRandomNumber: function (minNumber, maxNumber) {
      return Math.floor(minNumber + (Math.random() * (maxNumber + 1 - minNumber)));
    },
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
      return arr[window.keksUtilities.getRandomNumber(0, arr.length - 1)];
    },
    generateSequence: function (number) {
      var numbersArray = [];

      for (var i = 1; i <= number; i++) {
        numbersArray.push(i);
      }
      return numbersArray;
    },
    showVisualFeedback: function (element) {
      var removeAnimationClass = function () {
        element.classList.remove('jump');
        element.removeEventListener('animationend', removeAnimationClass);
      };
      element.addEventListener('animationend', removeAnimationClass);

      element.classList.add('jump');
    },
    limitValue: function (value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    // Taken from https://davidwalsh.name/javascript-debounce-function
    debounce: function (func, wait, immediate) {
      var timeout;
      return function () {
        var args = arguments;

        var later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(null, args);
          }
        };

        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) {
          func.apply(null, args);
        }
      };
    }
  };
})();
