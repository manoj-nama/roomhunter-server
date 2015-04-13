"use strict";

var async = require('async'),
    redis = require('../custom_modules/custom_redis');

module.exports = function (environment, callback) {

    //Add your task name here
    var env = {
        "common": [Test],
        "development": [Test],
        "production": [Test]
    };

    function play(environment) {
        async.series(env[environment], function (err, result) {
            log.cool('Booting process completed.');
            callback(err, result);
        })
    }

    play(environment);

    //Write your task here
    function Test(callback) {
        log.cool('Test Task Runner');
        callback(null, 'Test Task Runner')
    }
};

//Add a emitter transform for functions.
Function.prototype.toEmitter = function () {
    var origFunc = this;
    return function () {
        var args = arguments;
        var emitter = new process.EventEmitter();
        process.nextTick(function () {
            origFunc.apply(emitter, args);
        });
        return emitter;
    }
};
