# ngSync

Example:

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


## Installation Guide

Enter the following commands in the terminal

```bash
$ git clone https://github.com/munir7/ngSync.git
$ cd ngSync
$ npm install
$ gulp
```


### Prerequisites

* Must have [Git](http://git-scm.com/) installed

* Must have [node.js (at least v0.10.0)](http://nodejs.org/) installed with npm (Node Package Manager)

* Must have [Gulp](https://github.com/gulpjs/gulp) node package installed globally


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

- [MIT](LICENSE)
