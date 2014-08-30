# GAOWL

[![Dependency Status][dependency-image]][dependency-url] [![MIT License][license-image]][license-url]

### Requirements

Sails-disk or db adapter, Node v.0.10.30.

### Install

To use this demo do the following:

```sh
npm install
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
