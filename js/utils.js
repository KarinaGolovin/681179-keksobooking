'use strict';

var usefulUtilities = {
  // get random number in the range from...to
  getRandomNumber : function (minNumber, maxNumber) {
    return Math.floor(minNumber + (Math.random() * (maxNumber + 1 - minNumber)));
  }
}
