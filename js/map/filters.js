'use strict';

(function () {
  var PRICE_LOW = 10000;
  var PRICE_HIGH = 50000;

  window.keks = window.keks || {};
  window.keks.map = window.keks.map || {};

  window.keks.map.filters = function (config) {
    var filtersContainer = document.querySelector('.map__filters');
    var mapFilterList = filtersContainer.querySelectorAll('.map__filter');
    var defaultFunctionParam = window.keks.utilities.defaultFunctionParam;
    var onFiltersChange = defaultFunctionParam(config.onFiltersChange);

    var filtersState = {};

    var customFilters = {
      features: function (features) {
        for (var i = 0; i < filtersState.features.length; i++) {
          if (features.indexOf(filtersState.features[i]) === -1) {
            return false;
          }
        }

        return true;
      },
      price: function (price) {
        if (filtersState.price === 'low') {
          return price < PRICE_LOW;
        }

        if (filtersState.price === 'high') {
          return price > PRICE_HIGH;
        }

        if (filtersState.price === 'middle') {
          return price > PRICE_LOW && price < PRICE_HIGH;
        }

        return true;
      }
    };

    var handleFiltersChange = function (evt) {
      var name = evt.target.name.replace('housing-', '');
      var value = evt.target.value;

      if (evt.target.type !== 'checkbox') {
        filtersState[name] = value;
      } else {
        if (!filtersState[name]) {
          filtersState[name] = [];
        }

        var index = filtersState[name].indexOf(value);

        if (evt.target.checked) {
          filtersState[name].push(value);
        } else {
          filtersState[name] = [].concat(
              filtersState[name].slice(0, index),
              filtersState[name].slice(index + 1)
          );
        }
      }

      onFiltersChange();
    };

    filtersContainer.addEventListener('change', handleFiltersChange);

    var applyFilters = function (list) {
      var updatedList = list.slice();
      var keysToCheck = Object.keys(filtersState);

      updatedList = updatedList.filter(function (item) {
        var isValid = true;

        for (var i = 0; i < keysToCheck.length; i++) {
          var key = keysToCheck[i];

          if (filtersState[key] === 'any') {
            isValid = true;
          } else if (!item.offer[key]) {
            isValid = false;
          } else if (typeof customFilters[key] === 'function') {
            isValid = customFilters[key](item.offer[key]);
          } else {
            isValid = filtersState[key] === item.offer[key].toString();
          }

          if (!isValid) {
            break;
          }
        }

        return isValid;
      });

      return updatedList;
    };

    var enableFilters = function () {
      mapFilterList.forEach(function (element) {
        element.disabled = false;
      });
    };

    var disableFilters = function () {
      mapFilterList.forEach(function (element) {
        element.disabled = true;
      });
    };

    return {
      applyFilters: applyFilters,
      enableFilters: enableFilters,
      disableFilters: disableFilters
    };
  };
})();
