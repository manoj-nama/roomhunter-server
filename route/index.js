"use strict";

var Joi = require('joi'),
    redis = require('../custom_modules/custom_redis');
//Routs Lists
//Refer: http://hapijs.com/tutorials/routing
module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply) {
                reply('Welcome to Hapi Mongoose Boilerplate');
            }
        }
    }
];