'use strict';

(function () {
  window.keksForm = function (config) {
    var KEY_CODES = window.constants.KEY_CODES;
    var DEFAULT_AVATAR = 'img/muffin-grey.svg';

    var fieldsetList = document.querySelectorAll('fieldset');
    var adForm = document.querySelector('.ad-form');
    var main = document.querySelector('main');
    var errorPopupTemplate = document.querySelector('#error');
    var successPopupTemplate = document.querySelector('#success');
    var photoFormInsert = document.querySelector('.ad-form__photo-container');
    var avatarInsert = document.querySelector('.ad-form-header__preview');
    var previewImg = avatarInsert.querySelector('img');
    var addressInput = document.querySelector('#address');
    var priceInput = document.querySelector('#price');
    var typeSelect = document.querySelector('#type');
    // Time check
    var checkoutInput = document.querySelector('#timeout');
    var checkinInput = document.querySelector('#timein');
    var uploadInput = document.querySelector('.ad-form__upload');

    var showVisualFeedback = window.keksUtilities.showVisualFeedback;

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

    typeSelect.addEventListener('change', function (event) {
      var minPrice = mapTypeToPrice[event.target.value];
      priceInput.setAttribute('placeholder', minPrice);
      priceInput.setAttribute('min', minPrice);
    });

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
    var avatarInput = document.querySelector('#avatar');
    var avatarDropField = document.querySelector('.ad-form-header__drop-zone');
    var photosDropField = document.querySelector('.ad-form__drop-zone');

    var handleFileSelect = function (event) {
      var fileList = event.target.files;
      var file = fileList[0];
      previewImg.src = URL.createObjectURL(file);
    };

    avatarInput.addEventListener('change', handleFileSelect, false);

    // drag and drop avatar and fotos
    var declineDefaultAndPropagation = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    };

    var highlight = function (ev) {
      ev.target.classList.add('highlight');
    };

    var unhighlight = function (ev) {
      ev.target.classList.remove('highlight');
    };

    var previewFile = function (file) {
      var reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = function () {
        previewImg.src = URL.createObjectURL(file);
      }
    };

    var previewFiles = function (file) {
      var reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = function () {
          var imageContainer = document.createElement('div');
          var image = URL.createObjectURL(file);
          var imageElement = document.createElement('img');

          imageContainer.classList.add('ad-form__photo');
          imageElement.classList.add('ad-form__photo--element');
          imageElement.src = image;
          imageContainer.appendChild(imageElement);
          photoFormInsert.appendChild(imageContainer);
      };
    };

    var handleAvatar = function (files) {
      var files = [...files];
      var file = files[0];

      previewFile(file);
    };

    var handlePhoto = function (files) {
      var files = [...files];

      files.forEach(previewFiles);
    };

    var handleDrop = function (ev) {
      var data = ev.dataTransfer;
      var files = data.files;

      if(ev.target === avatarDropField) {
        handleAvatar(files);
      } else if (ev.target === photosDropField) {
        handlePhoto(files);
      }

    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      avatarDropField.addEventListener(eventName, declineDefaultAndPropagation, false);
      photosDropField.addEventListener(eventName, declineDefaultAndPropagation, false);
    });

    // highlight on hover
    ['dragenter', 'dragover'].forEach(eventName => {
      avatarDropField.addEventListener(eventName, highlight, false);
      photosDropField.addEventListener(eventName, highlight, false);
    });

    // unhighlight area
    ['dragleave', 'drop'].forEach(eventName => {
      avatarDropField.addEventListener(eventName, unhighlight, false);
      photosDropField.addEventListener(eventName, unhighlight, false);
    });

    avatarDropField.addEventListener('drop', handleDrop, false);
    photosDropField.addEventListener('drop', handleDrop, false);

    // Show uploaded fotos
    var handleFilesUpload = function (event) {
      var fileList = event.target.files;

      for (var i = 0; i < fileList.length; i++) {
        var imageContainer = document.createElement('div');
        var image = URL.createObjectURL(fileList[i]);
        var imageElement = document.createElement('img');

        imageContainer.classList.add('ad-form__photo');
        imageElement.classList.add('ad-form__photo--element');
        imageElement.src = image;
        imageContainer.appendChild(imageElement);
        photoFormInsert.appendChild(imageContainer);
      }
    };

    uploadInput.addEventListener('change', handleFilesUpload, false);

    // Submit - Reset
    var resetForm = function () {
      adForm.reset();
      adForm.querySelectorAll('.is-invalid').forEach(function (element) {
        element.classList.remove('is-invalid');
      });

      previewImg.src = DEFAULT_AVATAR;

      var photoFormElements = photoFormInsert.querySelectorAll('.ad-form__photo');
      photoFormElements.forEach(function (element) {
        photoFormInsert.removeChild(element);
      });
    };

    var disableForm = function () {
      adForm.classList.add('ad-form--disabled');

      fieldsetList.forEach(function (element) {
        element.disabled = true;
      });
    };

    var activateForm = function () {
      adForm.classList.remove('ad-form--disabled');

      fieldsetList.forEach(function (element) {
        element.disabled = false;
      });
    };

    var setAddress = function (x, y) {
      addressInput.value = x + ', ' + y;
      addressInput.defaultValue = addressInput.value;
    };

    var showSuccessMessage = function () {
      var cloneSuccessPopupTemplate = successPopupTemplate.content.cloneNode(true);
      var succesPopup = cloneSuccessPopupTemplate.querySelector('.success');

      main.appendChild(cloneSuccessPopupTemplate);
      var closeSuccessMessage = function () {
        document.removeEventListener('keydown', handleKeyPress);
        succesPopup.removeEventListener('click', closeMessageOnOutClick);
        main.removeChild(succesPopup);
      };

      var closeMessageOnOutClick = function (event) {
        event.preventDefault();
        if (event.target === succesPopup) {
          closeSuccessMessage();
        }
      };

      var handleKeyPress = function (event) {
        event.preventDefault();
        if (event.keyCode === KEY_CODES.esc) {
          closeSuccessMessage();
        }
      };
      document.addEventListener('keydown', handleKeyPress);
      succesPopup.addEventListener('click', closeMessageOnOutClick);
    };

    var showSubmitFormError = function () {
      var cloneErrorTemplate = errorPopupTemplate.content.cloneNode(true);
      var errorBlock = cloneErrorTemplate.querySelector('.error');
      var errorMessage = cloneErrorTemplate.querySelector('.error__message');
      errorMessage.textContent = 'Ошибка заполнения. Пожалуйста, исправьте форму и попробуйте еще раз.';

      main.appendChild(cloneErrorTemplate);

      var handleKeyPressOnError = function (event) {
        if (event.keyCode === KEY_CODES.esc) {
          closeErrorMessage();
        }
      };

      var closeErrorMessageOnOutClick = function (event) {
        event.preventDefault();
        if (event.target === errorBlock) {
          closeErrorMessage();
        }
      };

      var closeErrorMessage = function () {
        document.removeEventListener('keydown', handleKeyPressOnError);
        errorBlock.removeEventListener('click', closeErrorMessageOnOutClick);
        main.removeChild(errorBlock);
      };

      document.addEventListener('keydown', handleKeyPressOnError);
      errorBlock.addEventListener('click', closeErrorMessageOnOutClick);
    };

    var handleFormSave = function () {
      resetForm();
      showSuccessMessage();
      if (typeof config.onFormSave === 'function') {
        config.onFormSave();
      }
    };

    var submitAdForm = function () {
      event.preventDefault();
      var formData = new FormData(event.currentTarget);

      window.backend.save(handleFormSave, showSubmitFormError, formData);
    };

    adForm.addEventListener('submit', submitAdForm);
    adForm.addEventListener('reset', function (event) {
      resetForm(event);

      if (typeof config.onFormReset === 'function') {
        config.onFormReset();
      }
    });

    return {
      setAddress: setAddress,
      activateForm: activateForm,
      disableForm: disableForm
    };
  };
})();
