"use strict";


module.exports = function () {
    var redis = require('redis'),
        msg = 'Redis Plugin Enable',
        client;

    this.start = function (callback) {
        client = redis.createClient(_config.redis.port,
            _config.redis.host,
            {no_ready_check: true});

        if (_config.redis.password) {
            client.auth(_config.redis.password, function () {
                callback(null, client);
            });
        } else {
            callback('Redis: Entered Wrong Password', null);
        }
    };
};