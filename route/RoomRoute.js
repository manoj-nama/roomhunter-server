"use strict";

var Joi = require('joi');
var RoomService = require('../services/RoomService');
var UserService = require('../services/UserService');
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
                    description: Joi.string().optional(),
                    location: Joi.object(),
                    images: Joi.array().optional()
                }
            },
            handler: function (request, reply) {
                RoomService.create(request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message : "Error occurred. Please try again later."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message: "Room posted successfully."});
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
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
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
                    location_seoFriendlyName: Joi.string().required(),
                    description: Joi.string().optional(),
                    location_name: Joi.string().optional(),
                    images: Joi.array().optional()
                },
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                RoomService.update(request.params.id, request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
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
            handler: function (request, reply) {
                RoomService.delete(request.params.id)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: JSON.stringify(result)});
                    })
                    .on(EventName.NOT_FOUND, function (result) {
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
            handler: function (request, reply) {
                RoomService.getRoomsByCriteria(request.params.location, request.query)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: JSON.stringify(result)});
                    })
                    .on(EventName.NOT_FOUND, function (result) {
                        reply({statusCode: 404, data: []});
                    })
            }
        }
    },
    {
        path: '/api/room/shortlist/{userId}/{roomId}',
        method: "GET",
        config: {
            description: 'REST API to shortlist a room with a given id',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string().required(),
                    roomId: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                UserService.shortlistRoom(request.params.userId, request.params.roomId)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result});
                    })
            }
        }
    },
    {
        path: '/api/room/shortlist/remove/{userId}/{roomId}',
        method: "GET",
        config: {
            description: 'REST API to remove a room from shortlisted rooms of a user',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string().required(),
                    roomId: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                UserService.removeFromshortlisted(request.params.userId, request.params.roomId)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result});
                    })
            }
        }
    }
];
