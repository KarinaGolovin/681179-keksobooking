'use strict';

(function () {
  var KEY_CODES = window.constants.KEY_CODES;

  var mapBlock = document.querySelector('.map');
  var fieldsetList = document.querySelectorAll('fieldset');
  var mapFilterList = mapBlock.querySelectorAll('.map__filter');
  var adForm = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');
  var submitButton = document.querySelector('.ad-form__submit');
  var main = document.querySelector('main');
  var errorPopupTemplate = document.querySelector('#error');
  var successPopupTemplate = document.querySelector('#success');

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

    if (!value) {
      resetAllOptions(questCapacity);
    } else {
      lockUnavailableOptions(questCapacity, availableOptions);
    }
  });

  var resetAllOptions = function (selectElement) {
    var options = selectElement.childNodes;
    var isDefaultValue = selectElement.value === '';

    options.forEach(function (option) {
      option.disabled = false;
    });

    if (!isDefaultValue) {
      selectElement.value = '';
      showVisualFeedback(selectElement);
    }
  };

  var lockUnavailableOptions = function (selectElement, availableOptions) {
    var options = selectElement.childNodes;
    var isDefaultValue = selectElement.value === '';
    var isOptionAvailable = availableOptions.indexOf(selectElement.value) !== -1;

    if (!isOptionAvailable && !isDefaultValue) {
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
    toggleInputValididy(checkoutInput);
  });

  checkoutInput.addEventListener('change', function (event) {
    if (checkinInput.value !== event.target.value) {
      showVisualFeedback(checkinInput);
    }
    checkinInput.value = event.target.value;
    toggleInputValididy(checkinInput);
  });

  // Invalid input check to highlight
  var toggleInputValididy = function (input) {
    var isValid = input.validity.valid;

    input.classList.toggle('is-invalid', !isValid);
  };

  adForm.addEventListener('input', function (event) {
    if (event.target.classList.contains('is-invalid')) {
      toggleInputValididy(event.target);
    }
  });

  adForm.addEventListener('focusout', function (event) {
    toggleInputValididy(event.target);
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

  // --------- Submit - Reset

  var resetForm = function () {
    adForm.reset();
  };

  var submitAdForm = function () {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);

    var resetPage = function () {
      mapBlock.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');

      fieldsetList.forEach(function (element) {
        element.disabled = true;
      });

      mapBlock.classList.remove('map--active');

      mapFilterList.forEach(function (element) {
        element.disabled = true;
      });
    };

    var onFormSave = function () {
      resetPage();
      resetForm();
      var cloneSuccessPopupTemplate = successPopupTemplate.cloneNode(true);

      main.appendChild(cloneSuccessPopupTemplate);

      var closeSuccesMessage = function () {
        var succesPopup = main.querySelector('.success');
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('click', closeMessageOnOutClick);
        main.removeChild(succesPopup);
      };

      var closeMessageOnOutClick = function (event) {
        event.preventDefault();
        if (!event.target.closest('.popup-error')) {
          closeSuccesMessage();
        }
      };

      var handleKeyPress = function (event) {
        if (event.keyCode === KEY_CODES.esc) {
          closeSuccesMessage();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('click', closeMessageOnOutClick);
    };

    var showSubmitFormError = function () {
      var cloneErrorTemplate = errorPopupTemplate.content.cloneNode(true);
      var errorMessage = cloneErrorTemplate.querySelector('.error__message');
      errorMessage.textContent = 'Ошибка заполнения. Пожалуйста, исправьте форму и попробуйте еще раз.';
      var errorMessageButton = cloneErrorTemplate.querySelector('.error__button');

      main.appendChild(cloneErrorTemplate);

      var handleKeyPressOnError = function (event) {
        if (event.keyCode === KEY_CODES.esc) {
          closeErrorMessage();
        }
      };

      var closeErrorMessage = function () {
        var errorPopup = main.querySelector('.error');
        document.removeEventListener('keydown', handleKeyPressOnError);
        errorMessageButton.removeEventListener('click', closeErrorMessage);
        main.removeChild(errorPopup);
      };

      document.addEventListener('keydown', handleKeyPressOnError);
      errorMessageButton.addEventListener('click', closeErrorMessage);
    };

    window.backend.save(onFormSave, showSubmitFormError, formData);
  };
  adForm.addEventListener('submit', submitAdForm);
  resetButton.addEventListener('reset', resetForm);
})();
