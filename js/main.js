'use strict';

(function () {
  var map = window.keksMap({
    onPageActivate: function () {
      form.activateForm();
    },
    onPageReset: function () {
      form.disableForm();
    },
    onLocationChange: function (x, y) {
      form.setAddress(x, y);
    }
  });

  var form = window.keksForm({
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

  var initialPinLocation = map.addressSelector.getLocation();
  form.setAddress(initialPinLocation.x, initialPinLocation.y);
  form.disableForm();
})();
