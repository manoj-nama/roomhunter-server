"use strict";

var Joi = require('joi');
var StorageService = require('../services/StorageService');
var EventName = require('../src/enum/EventName');


//Routs Lists
module.exports = [
    {
        path: '/api/image/upload',
        method: 'POST',
        config: {
            description: 'REST API to upload and save given file',
            tags: ['api'],
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            handler: function (request, reply){
                StorageService.upload(request.payload.file)
                    .on(EventName.ERROR, function (err){
                        reply({statusCode: 500, error: err, message :"Error upload file."});
                    })
                    .on(EventName.DONE, function (result){
                        reply({statusCode: 200, data: result, message : "file uploaded successfully."});
                    })
            }
        }
    },
    {
        method: 'GET',
        path: '/uploads/{name}',
        config: {
            description: 'REST API to get  given file by name',
            tags: ['api'],
            validate: {
                params: {
                    name: Joi.string().required()
                }
            }
        },
        handler: function (request, reply){
            reply.file(request.params.name);
        }
    }];