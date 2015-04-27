"use strict";

//Variables List
var Hapi = require('hapi'),
    fs = require('fs'),
    globalUtility = require('./custom_modules/global_utility'),
    appConfig = require('./config/Config.json'),
    mongooseAuto = require('./custom_modules/mongooseAuto'),
    async = require('async'),
    log = require('./custom_modules/custom-imagemin-log'),
    hapiSwagger = require('hapi-swagger'),
    es6Support = require('./custom_modules/es6Support'),
    task = [],
    server = {},
    plug = require('./config/plug.json'),
    bootstrap,
    Basic = require('hapi-auth-bearer-token'),
    Path = require('path');
global.__appBaseDir = __dirname;

//Setting Up env
task.push(function (callback){
    process.env.name = process.env.name || 'development';
    var msg = 'Server Running on ' + process.env.name + ' Environment';
    log.info(msg);
    callback(null, msg);
});

//Custom Logger
task.push(function (callback){
    global.log = log;
    var msg = 'Setting up Custom Logger';
    log.info(msg);
    callback(null, msg);
});

//Setting up global object
//eg: _config, log
task.push(function (callback){
    globalUtility.setGlobalConstant({_config: appConfig[process.env.name]});
    var msg = 'Setting up Global Configuration';
    log.info(msg);
    callback(null, msg);
});

//Mongoose
task.push(function (callback){
    mongooseAuto(_config.database, callback);
});

//Running Bootstrap Task
task.push(function (callback){
    bootstrap = require('./config/Bootstrap');
    log.info('Booting up your application');
    bootstrap(process.env.name, callback);
});

//Init Server
task.push(function (callback){
    // Create a server with a host and port
    server = new Hapi.Server();
    server.connection({
        port: process.env.PORT || _config.server.port, routes: {
            cors: _config.server.allowCrossDomain, files: {
                relativeTo: Path.join(__dirname, 'uploads')
            }
        }
    });
    callback(null, 'server variable setting up');
});


//Add Plugin
task.push(function (callback){
    var plugin = [];

    plugin.push(function (cb){
        if (plug.hapiPlugin.Swagger) {

            server.register({
                register: hapiSwagger,
                options: {
                    basePath: 'http://' + _config.server.host + ':' + _config.server.port
                }
            }, function (err){
                if (err) {
                    var msg = 'Swagger interface loaded';
                    log.cool(msg);
                    cb(err, msg);
                } else {
                    cb(null, 'Swagger Plugin');
                }
            });
        } else {
            cb(null, 'Skip Swagger Plugin');
        }
    });

    plugin.push(function (cb){
        if (plug.hapiPlugin['hapi-auth-bearer-token']) {
            var msg = 'hapi-auth-bearer-token Enabled';
            var UserService = require('./services/UserService');
            server.register(Basic, function (err) {
                server.auth.strategy('simple', 'bearer-access-token', {
                    allowQueryToken: true,
                    allowMultipleHeaders: false,
                    accessTokenName: 'loginToken',
                    validateFunc: function (loginToken, callback) {
                        var request = this;
                        Model.User.findOne({loginToken: loginToken}, function (err, result) {
                            if (result) {
                                callback(null, true, {loginToken: loginToken});
                            } else {
                                callback(null, false, {loginToken: loginToken});
                            }
                        });
                    }
                });
                callback(err, msg);
            });
        } else {
            msg = 'hapi-auth-bearer-token Disable';
            callback(null, msg);
        }
    });
    async.parallel(plugin, function (err, rslt){
        callback(err, rslt);
    });
});

//Apply Routing Config
task.push(function (callback){

    function applyRouteConfig(dirPath){
        var dirName = dirPath;
        var data = fs.readdirSync(dirName);
        data.forEach(function (dta){
            var path = dirName + '/' + dta;
            if (fs.lstatSync(path).isDirectory()) {
                applyRouteConfig(path);
            } else {
                server.route(require(path));
            }
        });
    }

    applyRouteConfig(__dirname + '/route');
    var msg = 'Routs setup complete';
    log.info(msg);
    callback(null, msg);
});

//Run Server
async.series(task, function (err, data){
    if (err) {
        process.exit();
    } else {
        // Start the server
        server.start(function (){
            log.cool('Server running on : ' + _config.server.host + ' PORT:' + _config.server.port || process.env.PORT);
        });
    }
});

