"use strict";

var Joi = require('joi');
var UserService=require('../services/UserService');
var EventName=require('../src/enum/EventName');

//Routs Lists
module.exports = [
    {
        path: '/api/user',
        method: 'POST',
        config: {
            description: 'REST API in one go',
            notes: 'Yes, I am doing some fun..',
            tags: ['api'],
            auth: 'simple',
            handler:  function (request, reply){
                UserService.createUser(request)
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