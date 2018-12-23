'use strict';

(function () {
  window.keks = window.keks || {};

  var map = window.keks.map.map({
    onPageActivate: function () {
      form.activate();
    },
    onPageReset: function () {
      form.disable();
    },
    onLocationChange: window.keks.utilities.debounce(function (x, y) {
      form.setAddress(x, y);
    }, 100)
  });

  var form = window.keks.form({
    onSubmit: function () {
      form.lock();
    },
    onSave: function () {
      reset();
    },
    onReset: function () {
      reset();
    },
    onError: function () {
      form.unlock();
    }
  });


  var reset = function () {
    map.addressSelector.reset();
    map.resetPage();
    form.reset();
    form.disable();
    form.unlock();
  };

  var init = function () {
    map.filters.disableFilters();
    var initialPinLocation = map.addressSelector.getLocation();
    form.setAddress(initialPinLocation.x, initialPinLocation.y);
    form.disable();
  };

  init();
})();
