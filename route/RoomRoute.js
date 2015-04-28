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
            handler: function (request, reply){
                RoomService.create(request.payload)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: JSON.stringify(result)});
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
            handler: function (request, reply){
                RoomService.get(request.params.id)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: JSON.stringify(result)});
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
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply){
                RoomService.update(request.params.id, request.payload)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: JSON.stringify(result)});
                    })
            }
        }
    },
    {
        path: '/api/room/delete/{id}',
        method: "DELETE",
        config: {
            description: 'REST API to delete an existing room post',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply){
                RoomService.delete(request.params.id)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: JSON.stringify(result)});
                    })
                    .on(EventName.NOT_FOUND, function (result){
                        reply({statusCode: 404, data: null});
                    })
            }
        }
    },
    {
        path: '/api/room/search/{location}',
        method: 'GET',
        config: {
            description: 'REST API to get rooms by certain criteria',
            tags: ['api'],
            validate: {
                params: {
                    location: Joi.string().required()
                }
            },
            handler: function (request, reply){
                RoomService.getRoomsByCriteria(request.params.location, request.query)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: JSON.stringify(result)});
                    })
                    .on(EventName.NOT_FOUND, function (result){
                        reply({statusCode: 404, data: []});
                    })
            }
        }
    }
];