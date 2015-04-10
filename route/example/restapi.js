"use strict";

var Joi = require('joi');
var UserService = require('../../services/UserService');

//Routs Lists
module.exports = [
    {
        path: '/rest/user/create',
        method: 'POST',
        config: {
            description: 'REST API in one go',
            notes: 'Yes, I am doing some fun..',
            tags: ['api'],
            handler: UserService.create
        }
    }
];