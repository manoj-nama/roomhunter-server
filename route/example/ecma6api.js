"use strict";

var Joi = require('joi');

//Routs Lists
//Use ECMA6 Syntax and features like this (Traceur)
module.exports = [
    {
        path: '/Ecma6Script/example',
        method: 'GET',
        config: {
            description: 'ECMA-6 Now in your boilerplate',
            notes: 'Yes, I love ECMAScript-6',
            tags: ['api'],
            handler: (request, reply)=> {
                reply({status: 'my ecma6 special reply'});
            }
        }
    }
];