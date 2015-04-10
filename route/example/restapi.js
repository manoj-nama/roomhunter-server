"use strict";

var Joi = require('joi');
var UserService = require('../../services/UserService');

//Routs Lists
module.exports = [
    {
        path: '/rest/example/test',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        config: {
            description: 'REST API in one go',
            notes: 'Yes, I am doing some fun..',
            tags: ['api'],
            handler: UserService.create
        }
    }
];