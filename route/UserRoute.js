"use strict";

var Joi = require('joi');
var UserService=require('../services/UserService');
var EventName=require('../src/enum/EventName');

//Routs Lists
module.exports = [
    {
        path: '/api/user/authenticate',
        method: 'POST',
        config: {
            description: 'REST API for authenticating user.',
            tags: ['api'],
            auth: 'simple',
            handler:  function (request, reply){
                UserService.login(request)
                    .on(EventName.ERROR, function(err) {
                        reply("Internal Error");
                    })
                    .on(EventName.DONE, function(result) {
                        reply('hello, ' + JSON.stringify(result));
                    })
            }
        }
    },
    {
        path: '/api/user/create',
        method: 'POST',
        config: {
            description: 'REST API to create a new user',
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().required(),
                    password : Joi.string().required(),
                    firstName : Joi.string().optional(),
                    lastName : Joi.string().optional(),
                    mobile : Joi.number().optional()
                }
        },
            handler:  function (request, reply){
                UserService.create(request.payload)
                    .on(EventName.ERROR, function(err) {
                        reply("Internal Error");
                    })
                    .on(EventName.DONE, function(result) {
                        reply('hello, ' + JSON.stringify(result));
                    })
            }
        }
    },
    {
        path: '/api/user/get/{id}',
        method: 'GET',
        config: {
            description: 'REST API to get a user by given _id',
            tags: ['api'],
            validate : {
                params : {
                    id : Joi.string().required()
                }
            },
           /* auth: 'simple',*/
            handler:  function (request, reply){
                UserService.get(request.params.id)
                    .on(EventName.ERROR, function(err) {
                        reply("Internal Error");
                    })
                    .on(EventName.DONE, function(result) {
                        reply(JSON.stringify(result));
                    })
            }
        }
    },
    {
        path: '/api/user/logout',
        method: 'POST',
        config: {
            description: 'REST API for logging out a user',
            tags: ['api'],
            auth: 'simple',
            handler:  function (request, reply){
               request.auth = null;
                reply(true);
            }
        }
    }
];