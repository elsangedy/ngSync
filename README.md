# ngSync

```javascript
var module = angular.module('myModdule', ['ngSync']);

module.config(['$httpProvider', '$syncProvider', function($httpProvider, $syncProvider)
{
  $httpProvider.interceptors.push('SyncInterceptor');

  $syncProvider.options({
    urlRoot: 'http://api.mydomain.com/v1/' // empty for all urls
    // other configs
  });
}]);
```