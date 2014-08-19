# GAOWL

[![Dependency Status][dependency-image]][dependency-url] [![MIT License][license-image]][license-url]

### Requirements

As for right now, the demo will only work with database adapter. Please use your adapter of choice until the issue in sails-disk is resolved.

### Install

To use this demo do the following:

```sh
npm install
```

Then go to the node_modules folder and change  waterlock-local-auth/lib/controllers/actions/login.js to use bcryptjs instead of bcrypt (this is needed as bcrypt has dependencies that have issues compiling on windows)

```
var bcrypt = require('bcrypt'); => var bcrypt = require('bcryptjs');
```

now you can do a ``` sails lift ```

The app will automatically download the bower packages for you and add them to the assets folder (courtesy of sails-generator-bower-gulp).

To change the database store from local disk to another, like mongo for example, just edit the config/connections.js and the models.js files with the appropriate connection info.

Mongo has already been configured for localhost with no username and password.

### Issues

Currently this app works with databases, but not with sails-disk due to a bug in the adapter
More on this can be found [here](https://github.com/balderdashy/sails-disk/issues/21)


## License

**[MIT](./LICENSE)**
&copy; 2014 [Karnith](http://github.com/Karnith)

[Sails](http://sailsjs.org) is free and open-source under the [MIT License](http://sails.mit-license.org/).

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE.md

[dependency-image]: https://gemnasium.com/Karnith/GAOWL.svg?style=flat
[dependency-url]: https://gemnasium.com/Karnith/GAOWL

[coverage-image]: http://img.shields.io/coveralls/Karnith/GOWL/master.svg?style=flat
[coverage-url]: https://coveralls.io/r/Karnith/GOWL?branch=master
