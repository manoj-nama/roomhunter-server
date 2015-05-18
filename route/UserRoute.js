"use strict";

var Joi = require('joi');
var UserService = require('../services/UserService');
var RoomService = require('../services/RoomService');
var EventName = require('../src/enum/EventName');

//Routs Lists
module.exports = [
    {
        path: '/api/user/authenticate',
        method: 'POST',
        config: {
            description: 'REST API for authenticating user.',
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                UserService.login(request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message: "Invalid login credentials. Please try again."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message : "Login successful."});
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
                    password: Joi.string().required(),
                    firstName: Joi.string().optional(),
                    lastName: Joi.string().optional(),
                    personalDetails:Joi.object().keys({
                        phone: Joi.number().optional()
                    })
                }
            },
            handler: function (request, reply) {
                UserService.create(request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message : "Error occurred. Please try again later."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message: "Account created successfully. A link has been sent to your email Id. Click on it to activate your account."});
                    })
                    .on(EventName.ALREADY_EXIST, function (result) {
                        reply({statusCode: 204, data: null, message: "Email Id already exist. Please try with another email."});
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
            auth: 'simple',
            validate: {
                params: {
                    id: Joi.string().required(),
                    loginToken: Joi.string()
                }
            },
            handler: function (request, reply) {
                UserService.get(request.params.id)
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
        path: '/api/user/logout/{id}',
        method: 'GET',
        config: {
            description: 'REST API for logging out a user',
            tags: ['api'],
            auth: 'simple',
            handler: function (request, reply) {
                UserService.logout(request.params.id)
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
        path: '/api/user/update/{id}',
        method: 'PUT',
        config: {
            description: 'REST API to update an existing user',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                UserService.update(request.params.id, request.payload)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message : "Error updating profile."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: JSON.stringify(result), message : "Profile updated successfully."});
                    })
            }
        }
    },
    {
        path: '/api/user/delete/{id}',
        method: "DELETE",
        config: {
            description: 'REST API to delete an existing user',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                UserService.delete(request.params.id)
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
        path: '/api/user/rooms/{userId}',
        method: 'GET',
        config: {
            description: "REST API to get rooms posted by a user",
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string().required()
                }
            },
            auth: 'simple',
            handler: function (request, reply) {
                RoomService.getRoomsByUserId(request.params.userId)
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
        path: '/api/user/verify/{code}',
        method: 'GET',
        config: {
            description: "API to verify a user account",
            tags: ['api'],
            validate: {
                params: {
                    code: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                UserService.verifyUser(request.params.code)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message:"Error occurred. Please try again later."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message:"Account verified successfully. Please proceed to login."});
                    })
                    .on(EventName.NOT_FOUND, function (result) {
                        reply({statusCode: 404, data: null, message:"Invalid link. Please try with correct link."});
                    })
            }
        }
    },
    {
        path: '/api/user/send/message',
        method: 'POST',
        config: {
            description: 'REST API to send message to a user',
            tags: ['api'],
            validate: {
                payload: {
                    to: Joi.string().required(),
                    from: Joi.string().required(),
                    message: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                UserService.sendMessage(request.payload.to, request.payload.from, request.payload.message)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: null});
                    })
            }
        }
    },
    {
        path: '/api/user/send/link/resetPassword',
        method: 'POST',
        config: {
            description: "API to send a reset password link to a user",
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                UserService.sendResetPasswordLink(request.payload.email)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message:"Error occurred. Please try again later."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message:"Link send successfully."});
                    })
                    .on(EventName.NOT_FOUND, function (result) {
                        reply({statusCode: 404, data: null, message:"User not found."});
                    })
            }
        }
    },
    {
        path: '/api/user/verify/link/resetPassword/{code}',
        method: 'GET',
        config: {
            description: "API to verify a user's reset password link",
            tags: ['api'],
            validate: {
                params: {
                    code: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                UserService.verifyResetPasswordLink(request.params.code)
                    .on(EventName.ERROR, function (err) {
                        reply({statusCode: 500, error: err, message:"Error occurred. Please try again later."});
                    })
                    .on(EventName.DONE, function (result) {
                        reply({statusCode: 200, data: result, message:"Valid link."});
                    })
                    .on(EventName.NOT_FOUND, function (result) {
                        reply({statusCode: 404, data: null, message:"Invalid link. Please try with correct link."});
                    })
            }
        }
    }
];
