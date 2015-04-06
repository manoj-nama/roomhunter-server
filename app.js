"use strict";

//Variables List
var Hapi = require('hapi'),
    fs = require('fs'),
    globalUtility = require('./custom_modules/global_utility'),
    appConfig = require('./config/Config.json'),
    mongooseAuto = require('./custom_modules/mongooseAuto'),
    async = require('async'),
    log = require('./custom_modules/custom-imagemin-log'),
    pack = require('./package.json'),
    hapiSwagger = require('hapi-swagger'),
    es6Support = require('./custom_modules/es6Support'),
    task = [],
    server = {},
    plug = require('./config/plug.json'),
    bootstrap;

//Setting Up env
task.push(function (callback) {
    process.env.name = process.env.name || 'development';
    var msg = 'Server Running on ' + process.env.name + ' Environment';
    log.info(msg);
    callback(null, msg);
});

//Custom Logger
task.push(function (callback) {
    global.log = log;
    var msg = 'Setting up Custom Logger';
    log.info(msg);
    callback(null, msg);
});

//Setting up global object
//eg: _config, log
task.push(function (callback) {
    globalUtility.setGlobalConstant({_config: appConfig[process.env.name]});
    var msg = 'Setting up Global Configuration';
    log.info(msg);
    callback(null, msg);
});

//ECMA6 Support Plugin
task.push(function (callback) {
    var msg = 'ECMA6 Plugin Enable';
    if (plug.ecma6Plugin.enabled) {
        globalUtility.setGlobalConstant({requireEcma6: es6Support(__dirname, plug.ecma6Plugin.debug).init});
        es6Support(__dirname, plug.ecma6Plugin.debug).clear();
        log.info(msg);
        callback(null, msg);
    } else {
        global.requireEcma6 = require;
        msg = 'ECMA6 Plugin Disable';
        log.info(msg);
        callback(null, msg);
    }
});

//Mongoose
task.push(function (callback) {
    mongooseAuto(_config.database, callback);
});

//Running Bootstrap Task
task.push(function (callback) {
    if (plug.ecma6Plugin.enabled) {
        bootstrap = requireEcma6('config/Bootstrap.js');
    } else {
        bootstrap = require('./config/Bootstrap');
    }
    log.info('Booting up your application');
    bootstrap(process.env.name, callback);
});

//Init Server
task.push(function (callback) {
    // Create a server with a host and port
    server = new Hapi.Server(process.env.PORT = process.env.PORT || _config.server.port, {cors: _config.server.allowCrossDomain});
    callback(null, 'server variable setting up');
});

//Add Plugin
task.push(function (callback) {
    var plugin = [];

    plugin.push(function (cb) {
        if (plug.hapiPlugin.Swagger) {
            server.pack.register({
                plugin: hapiSwagger,
                options: {
                    apiVersion: pack.version,
                    basePath: 'http://' + _config.server.host + ':' + _config.server.port,
                    payloadType: 'json'
                }
            }, function (err) {
                var msg = 'Swagger interface loaded';
                log.cool(msg);
                cb(err, msg);
            });
        } else {
            cb(null, 'Skip Swagger Plugin');
        }
    });

    plugin.push(function (callback) {
        var msg = 'Hapi Auth Cookie Enabled';
        if (plug.hapiPlugin.hapiAuthCookie) {
            server.pack.register(require('hapi-auth-cookie'), function (err) {
                server.auth.strategy('session', 'cookie', {
                    password: _config.cookie.password,
                    cookie: _config.cookie.cookie,
                    redirectTo: _config.cookie.redirectTo,
                    isSecure: _config.cookie.isSecure
                });
                callback(err, msg)
            });
        } else {
            msg = 'Hapi Auth Cookie Disable';
            callback(null, msg);
        }
    });

    async.parallel(plugin, function (err, rslt) {
        callback(err, rslt);
    });
});

//Apply Routing Config
task.push(function (callback) {

    function applyRouteConfig(dirPath) {
        var dirName = dirPath;
        var data = fs.readdirSync(dirName);
        data.forEach(function (dta) {
            var path = dirName + '/' + dta;
            if (fs.lstatSync(path).isDirectory()) {
                applyRouteConfig(path);
            } else {
                if (plug.ecma6Plugin.enabled) {
                    server.route(requireEcma6(path));
                } else {
                    server.route(require(path));
                }
            }
        });
    }

    applyRouteConfig(__dirname + '/route');
    var msg = 'Routs setup complete';
    log.info(msg);
    callback(null, msg);
});

//Run Server
async.series(task, function (err, data) {
    if (err) {
        process.exit();
    } else {
        // Start the server
        server.start(function () {
            log.cool('Server running on SERVER: ' + _config.server.host + ' PORT:' + process.env.PORT);
        });
    }
});

