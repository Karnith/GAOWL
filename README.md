# GAOWL (under development)

a [Sails](http://sailsjs.org) application demo built with my gulp generators, waterlock and waterlock local auth.

### Install

Currently this app works with databases, but not with sails-disk. Looking into the issue...

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
