(function() {
  'use strict';

  var ngSync = angular.module(
    // module name
    'ngSync',

    // angular dependencies
    [
      'ng'
    ]
  );

  ngSync.provider('$sync', SyncProvider);
  ngSync.factory('SyncOnline', SyncOnline);
  ngSync.factory('SyncInterceptor', SyncInterceptor);

  //---

  SyncProvider.$inject = [];

  function SyncProvider() {

    var defaultOptions = {
      urlRoot: ''
    };

    var globalOptions = {};

    var queues = [];

    var online = true;

    // set options
    this.options = function(value) {
      angular.extend(globalOptions, value);
    };

    //---

    this.$get = syncProviderGet;

    //---

    syncProviderGet.$inject = ['$rootScope', '$q', 'SyncOnline'];

    function syncProviderGet($rootScope, $q, SyncOnline) {

        var options = angular.extend({}, defaultOptions, globalOptions);

        var provider = {
          getConfig: getConfig,
          addQueue: addQueue,
          getQueues: getQueues,
          sync: sync,
          init: init,
          isUrlRoot: isUrlRoot
        };

        return provider;

        //---

        function getConfig(key)
        {
          return options[key];
        }

        //---

        function addQueue(config)
        {
          config = {
            url: config.url,
            method: config.method.toUpperCase(),
            data: config.data,
            headers: config.headers
          };

          if(config.method != 'DELETE' && config.method != 'POST' && config.method != 'PUT') {
            return;
          }

          config.$$hashKey = (Math.floor(Math.random() * 1000000000));
          queues.push(config);

          window.sessionStorage.setItem('sync:queues', JSON.stringify(queues));

          $rootScope.$broadcast('sync:addQueue', config);
        }

        //---

        function getQueues()
        {
          if(JSON.parse(window.sessionStorage.getItem('sync:queues')) === null) {
            window.sessionStorage.setItem('sync:queues', JSON.stringify(queues));
          } else {
            queues = JSON.parse(window.sessionStorage.getItem('sync:queues'));
          }

          return queues;
        }

        //---

        function sync()
        {
          if(!SyncOnline.isOnline())
            return;

          if(queues.length === 0)
            return;

          angular.forEach(queues, function(value, key) {
            processSync(value, key);
          });
        }

        //---

        function init() {
          $rootScope.$on('sync:online', function()
          {
            if(!online)
              sync();

            online = true;
          });

          $rootScope.$on('sync:offline', function()
          {
            online = false;
          });
        }

        //---

        function processSync(value, key)
        {
          if(!SyncOnline.isOnline())
            return;

          var xhr = new XMLHttpRequest();

          xhr.open(value.method, value.url);

          var arr = [];

          angular.forEach(value.headers, function(v, k)
          {
            xhr.setRequestHeader(k, v);
            arr.push(k);
          });

          $q.all(arr).then(function(values) {
            xhr.send(JSON.stringify(value.data));
          }, function(reason) {
            deferred.reject(reason);
          });

          xhr.onload = function(e)
          {
            delQueue(key);
          };
        }

        //---

        function delQueue(key)
        {
          $rootScope.$broadcast('sync:delQueue', queues[key]);

          queues.splice(key, 1);

          window.sessionStorage.setItem('sync:queues', JSON.stringify(queues));
        }

        //---

        function isUrlRoot(config) {
          var parm = 'urlRoot';
          return (options[parm] === '' || config.url.indexOf(options[parm]) >= 0);
        }

    }

  }

  //---

  SyncInterceptor.$inject = ['$q', '$sync', '$rootScope', 'SyncOnline'];

  function SyncInterceptor($q, $sync, $rootScope, SyncOnline) {

    var service = {
      request: request,
      requestError: requestError,
      response: response,
      responseError: responseError
    };

    return service;

    //---

    function request(config) {
      // TODO: alterar para !SyncOnline.isOnline(), para cair somente quando estiver sem internet
      if(SyncOnline.isOnline() && $sync.isUrlRoot(config)) {
        $sync.addQueue(config);
      }

      return config;
    }

    //---

    function requestError(rejection) {
      if(rejection.status && rejection.status < 12000) {
        $rootScope.$broadcast('sync:online');
      } else {
        $rootScope.$broadcast('sync:offline');
      }

      return $q.reject(rejection);
    }

    //---

    function response(result) {
      $rootScope.$broadcast('sync:online');

      return result;
    }

    //---

    function responseError(rejection) {
      if(rejection.status && rejection.status < 12000) {
        $rootScope.$broadcast('sync:offline');
      } else {
        $rootScope.$broadcast('sync:offline');
      }

      return $q.reject(rejection);
    }

  }

  //---

  SyncOnline.$inject = ['$window'];

  function SyncOnline($window) {

    var service = {
      online: $window.navigator.onLine,
      isOnline: isOnline
    };

    return service;

    //---

    function isOnline() {
      return service.online;
    }

    //---

    $window.addEventListener("offline", function() {
      service.online = false;
      $rootScope.$broadcast('sync:offline');
      $rootScope.$digest();
    }, false);

    $window.addEventListener("online", function() {
      service.online = true;
      $rootScope.$broadcast('sync:online');
      $rootScope.$digest();
    }, false);

  }

})(this);