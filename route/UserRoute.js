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
            description: 'REST API in one go',
            tags: ['api'],
            handler:  function (request, reply){
                UserService.create({
                    firstName: "Sandeep",
                    lastName: "Chhapola",
                    email: "schhapola0001@gmail.com",
                    password: "sandy1234"
                })
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
        path: '/api/user/get',
        method: 'GET',
        config: {
            description: 'REST API in one go',
            tags: ['api'],
            auth: 'simple',
            handler:  function (request, reply){
                UserService.create(request)
                    .on(EventName.ERROR, function(err) {
                        reply("Internal Error");
                    })
                    .on(EventName.DONE, function(result) {
                        reply('hello, ' + JSON.stringify(result));
                    })
            }
        }
    }
];