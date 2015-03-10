# angular-sync


var module = angular.module('myModdule', [angular-sync]);

module..config(['$httpProvider', function($httpProvider)
{
  $httpProvider.interceptors.push('AngularSyncInterceptor');
}]);