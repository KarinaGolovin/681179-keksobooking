'use strict';

(function () {
  window.keks = window.keks || {};

  var TIMEOUT = 10000;

  var load = function (config) {
    var url = config.url;
    var onSuccess = config.onSuccess;
    var onError = config.onError;
    var method = config.method;
    var data = config.data;

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);
  };

  window.keks.backend = {
    save: function (onLoad, onError, data) {
      load({
        url: 'https://js.dump.academy/keksobooking',
        onSuccess: onLoad,
        onError: onError,
        method: 'POST',
        data: data
      });
    },
    load: function (onLoad, onError) {
      load({
        url: 'https://js.dump.academy/keksobooking/data',
        onSuccess: onLoad,
        onError: onError,
        method: 'GET'
      });
    }
  };
})();
