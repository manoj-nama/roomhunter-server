
"use strict";

var Joi = require('joi');
var RoomService = require('../services/RoomService');
var EventName = require('../src/enum/EventName');


//Routs Lists
module.exports = [
    {
        path: '/api/room/create',
        method: 'POST',
        config: {
            description: 'REST API to create a new room post',
            tags: ['api'],
            validate: {
                payload: {
                    userId: Joi.string().required(),
                    title: Joi.string().required(),
                    price: Joi.string().required(),
                    propertyType: Joi.string().required(),
                    isFurnished: Joi.string().required(),
                    location_seoFriendlyUrl: Joi.string().required(),
                    description: Joi.string().optional(),
                    location_name: Joi.string().optional(),
                    images: Joi.string().optional()
                }
            },
            handler: function (request, reply) {
                RoomService.create(request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply("Error", err);
                    })
                    .on(EventName.DONE, function (result) {
                        reply(JSON.stringify(result));
                    })
            }
        }
    },
    {
        path: '/api/room/get/{id}',
        method: 'GET',
        config: {
            description: 'REST API to get a room by given _id',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                RoomService.get(request.params.id)
                    .on(EventName.ERROR, function (err) {
                        reply("Internal Error");
                    })
                    .on(EventName.DONE, function(result) {
                        reply(JSON.stringify(result));
                    })
            }
        }
    },
    {
        path: '/api/room/update/{id}',
        method: 'PUT',
        config: {
            description: 'REST API to update an existing room',
            tags: ['api'],
            validate: {
                payload: {
                    userId: Joi.string().required(),
                    title: Joi.string().required(),
                    price: Joi.string().required(),
                    propertyType: Joi.string().required(),
                    isFurnished: Joi.string().required(),
                    location_seoFriendlyUrl: Joi.string().required(),
                    description: Joi.string().optional(),
                    location_name: Joi.string().optional(),
                    images: Joi.string().optional()
                },
                params:{
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                RoomService.update(request.params.id, request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply("Error", err);
                    })
                    .on(EventName.DONE, function (result) {
                        reply(JSON.stringify(result));
                    })
            }
        }
    }
];