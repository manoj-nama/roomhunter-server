**Table of Contents**
- [Hapi Mongoose Boilerplate](#Hapi-Mongoose-Boilerplate)
  - [Installation](#installation)
    - [Download (git)](#download-git)
    - [NPM Install (npm)](#npm-install)
  - [Boilerplate Structure](#boilerplate-structure)
  - [Setting up configration](#setting-up-configration)
    - [Bootstrap.js](#bootstrap.js)
    - [Config.json](#Config.json)
    - [plug.json](#plug.json)
  - [Mongoose Domain and Modal](#mongoose-domain-n-modal)
    - [domain](#domain)
      - [Define User Domain](#define-user-domain)
      - [User Modal](#user-modal)
  - [How to define Routes ](#how-to-define-routes)
    - [Route](#route)
  - [How to use ECMA6 feature](#how-to-use-ecma6-feature)
  - [Lets Build Together](#lets-build-together)
  - [Revision History](#revision-history)

#Hapi Mongoose Boilerplate#
This Boilerplate is ready to use pack having very exciting feature of HapiJs and MongooseJs. This Boilerplate having some of common plugin which can be used as per required.

This boilerplate will give you a quick start to your Node Application Server with HapiJs.

This Boilerplate also supports ``ECAMA Script 6`` syntax. For that Traceur library has been used. We are Hapi to release this exciting version to build your Node app on Hapi-Mongoose-Boilerplate.

##Installation##
This library is available for **Node** only. See the installation steps below:

###Download(GIT)###
```bash
$ git clone git@github.com:kashishgupta1990/HapiMongooseBoilerplate.git
```
###NPM Install(npm)###
```bash
$ npm install
```
##Boilerplate Structure##

  - config
    - Bootstrap.js
    - Config.json
    - plugin.json
  - custom_modules
   - custom-imagemim-log
   - custom_redis
   - es6Support
   - global-utility
   - mongooseAuto
  - domain
   - SampleModel.js
   - User.js
   - add more models yourself ...
  - route
   - api
       - test1.js
       - add more file yourself ...
   - example
       - auth.js
       - dbOperation.js
       - ecma6api.js
       - redisOperation.js
       - restapi.js
       - add more file yourself ...
    - sample
       - restapi.js
       - add more files yourself...
   - add more route folder yourself...


##Setting up configration##
###Bootstrap.js###
``Bootstrap.js`` is a task runner file which executes on start of application according to appropriate environment settings.
See below given snippet for quick start to create task named ``Test`` and run on ``development`` environment
```javascript
module.exports = function (environment, callback) {

    //Add your task name here
    var env = {
        "development": [Test]
    };

    //Create your task like function
    function Test(callback) {
        log.cool('Test Task Runner');
        callback(null, 'Test Task Runner')
    }
};
```

###Config.json###
``Config.json`` contains all the application level configuration variables. Use config.json file by ``_config`` as global variable.
```javascript
"development": {
    "server": {
      "host": "localhost",
      "port": "7002",
      "allowCrossDomain": true
    },
    "database": {
      "url": "mongodb://localhost:27017/boilerplate",
      "poolSize": 5,
      "tryToConnect": true
    },
    "cookie": {
      "password": "secret",
      "cookie": "hm-boilerplate",
      "redirectTo": "/login",
      "isSecure": false
    },
    "redis": {
      "resource": "",
      "host": "enter-your-redis-host-name",
      "port": 17203,
      "password": "your-password"
    }
  }
```

###plug.json###
``plug.json`` you can plug/unplug your boilerplate extra feature like Hapi Swagger etc using plug.js.
```javascript
{
  "hapiPlugin": {
    "Swagger": true, //Yes, I want Hapi Swagger
    "hapiAuthCookie": true //Yes, I want AuthCookie
  },
  "ecma6Plugin": {
    "enabled": true, //Yes, I want to enable ECMAScript6
    "debug": false //But I dont want to see debug result
  }
}
```
##Mongoose Domain and Modal##

###domain###
``domain`` is a home for all mongoose domain. You just have to create file like ``User.js``, define mongoose schema into file, that's all.
You can access your mongoose modal form any where in boilerplate (routes, bootstarp files) by ``Modal`` object.
Examples are given below:

####Define User Domain####
``Define User Domain`` in /domain/User.js
```javascript
"use strict";

//Define User Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    username: String,
    password: String
};
```
####User Modal####
Use ``User Modal`` any where from routs / bootstrap
```javascript
//Save New User
new Modal.User({
      username: "admin",
      password: "admin"
    }).save(function (err, result) {
               if (err) {
                  log.error("Error Save Record: " + err);
               } else {
                  log.cool('User Save Successfully');
               }
       })

//Get User
Modal.User.find({username: 'admin'}, function (err, data) {
            if (err) {
                log.error(err);
            } else {
                log.cool(data);
            }
})
```
##How to define Routes##

###Route###
``route`` is a folder where we can define routs. Create folder in side route folder or you can directly create file with any name we want. File should follow this type of syntax. Here you can write handlers in ``Javascript ECMAScript-6`` syntax like below.
```javascript
"use strict";
var Joi = require('joi');
//Routs Lists
module.exports = [
    {
        path: '/sample/test/special',
        method: 'GET',
        config: {
            description: 'Get Test-1',
            notes: 'Yes, I am doing testing',
            tags: ['api'],
            handler: (request, reply)=> {
                reply({status: 'my ecma6 special reply'});
            }
        }
    },
    {
        path: '/sample/test/test2',
        method: ['GET', 'POST'],
        config: {
            description: 'Get Test-2',
            notes: 'Yes, I am doing testing',
            tags: ['api'],
            handler: function (request, reply) {
                reply({status: 'I am Test-2 API'});
            }
        }
    },
    {
        //Here you can add more routs (Hapi Syntax)
        //Refer: http://hapijs.com/tutorials/routing
    }
];
```

##How to use ECMA6 feature##
We have introduced a new way to require special ECMA6 supporting files. Use ``requireEcma6`` instead of ``require`` to include ecma6 file. It will compile ecma6 files to ecma5 using ``Traceur`` module.
As result, It will generate a compiled version of file in ``custome_modules/es6Support/temp`` folder. It means when you require ecma6 files you have to pass relative path of your es6 file according to temp directory.
By default we can use ecma6 syntax on route directory and bootstrap.js file.

##Lets Build Together##
Just open an issue in case found any bug(There is always a scope of improvement). We are always open for suggestion / issue / add new feature request. Fork and start creating pull request. :-)

##Revision History##
* **Version v0.0.1**: The first poc release v0.0.1.
