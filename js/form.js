'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');

  var showVisualFeedback = window.usefulUtilities.showVisualFeedback;

  // Room capacity Validity check
  var roomCount = document.querySelector('#room_number');
  var questCapacity = document.querySelector('#capacity');

  var roomDependencies = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['2', '3'],
    '100': ['0']
  };

  roomCount.addEventListener('change', function (event) {
    var value = event.target.value;
    var availableOptions = roomDependencies[value];
    lockUnavailableOptions(questCapacity, availableOptions, value);
  });

  var lockUnavailableOptions = function (selectElement, availableOptions, value) {
    var options = selectElement.childNodes;
    if (!value) {
      options.forEach(function (option) {
        option.disabled = false;
      });
      selectElement.value = '';
      showVisualFeedback(questCapacity);
      return;
    }

    if (availableOptions.indexOf(selectElement.value) === -1) {
      selectElement.value = '';
      showVisualFeedback(questCapacity);
    }
    options.forEach(function (option) {
      if (option.value && availableOptions.indexOf(option.value) === -1) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  };

  // Price check
  var mapTypeToPrice = {
    '': 'Цена за ночь...',
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var priceInput = document.querySelector('#price');
  document.querySelector('#type').addEventListener('change', function (event) {
    var minPrice = mapTypeToPrice[event.target.value];
    priceInput.setAttribute('placeholder', minPrice);
    priceInput.setAttribute('min', minPrice);
  });

  // Time check
  var checkoutInput = document.querySelector('#timeout');
  var checkinInput = document.querySelector('#timein');

  checkinInput.addEventListener('change', function (event) {
    checkoutInput.setAttribute('placeholder', event.target.value);
    if (checkoutInput.value !== event.target.value) {
      showVisualFeedback(checkoutInput);
    }
    checkoutInput.value = event.target.value;
    applyInputValidation(checkoutInput);
  });

  checkoutInput.addEventListener('change', function (event) {
    if (checkinInput.value !== event.target.value) {
      showVisualFeedback(checkinInput);
    }
    checkinInput.value = event.target.value;
    applyInputValidation(checkinInput);
  });

  // Invalid input check to highlight
  var applyInputValidation = function (input) {
    var isValid = input.validity.valid;

    input.classList.toggle('is-invalid', !isValid);
  };

  adForm.addEventListener('input', function (event) {
    if (event.target.classList.contains('is-invalid')) {
      applyInputValidation(event.target);
    }
  });

  adForm.addEventListener('focusout', function (event) {
    applyInputValidation(event.target);
  });

  // Show avatar preview
  var handleFileSelect = function (event) {
    var fileList = event.target.files;
    var file = fileList[0];

    var avatarInsert = document.querySelector('.ad-form-header__preview');
    var previewImg = avatarInsert.querySelector('img');
    previewImg.src = URL.createObjectURL(file);
  };

  var avatarInput = document.querySelector('#avatar');
  avatarInput.addEventListener('change', handleFileSelect, false);

  // Show uploaded fotos
  var handleFilesUpload = function (event) {
    var fileList = event.target.files;
    var photoFormInsert = document.querySelector('.ad-form__photo-container');

    for (var i = 0; i < fileList.length; i++) {
      var imageContainer = document.createElement('div');
      imageContainer.classList.add('ad-form__photo');

      var image = URL.createObjectURL(fileList[i]);
      var imageElement = document.createElement('img');
      imageElement.classList.add('ad-form__photo--element');
      imageElement.src = image;
      imageContainer.appendChild(imageElement);
      photoFormInsert.appendChild(imageContainer);
    }
  };

  document.querySelector('.ad-form__upload').addEventListener('change', handleFilesUpload, false);
})();
