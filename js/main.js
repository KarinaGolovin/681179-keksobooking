'use strict';

(function () {
  window.keks = window.keks || {};

  var map = window.keks.map.map({
    onPageActivate: function () {
      form.activateForm();
    },
    onPageReset: function () {
      form.disableForm();
    },
    onLocationChange: window.keks.utilities.debounce(function (x, y) {
      form.setAddress(x, y);
    }, 100)
  });

  var form = window.keks.form({
    onFormSave: function () {
      map.addressSelector.resetToStartPosition();
      map.resetPage();
      form.resetForm();
      form.disableForm();
    },
    onFormReset: function () {
      map.addressSelector.reset();
    }
  });

  map.filters.disableFilters();
  var initialPinLocation = map.addressSelector.getLocation();
  form.setAddress(initialPinLocation.x, initialPinLocation.y);
  form.disableForm();
})();
