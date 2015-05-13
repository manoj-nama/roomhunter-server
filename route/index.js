"use strict";

var Joi = require('joi'),
    req = require('request'),
    geoCity = require('../src/geoName1000City');
//Routs Lists
//Refer: http://hapijs.com/tutorials/routing
module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply){
                reply('Welcome to Hapi Mongoose Boilerplate');
            }
        }
    },
    {
        method: 'GET',
        path: '/api/location/{text}',
        config: {
            validate: {
                params: {
                    text: Joi.string().required()
                }
            },
            handler: function (request, reply){
                req.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + request.params.text + '&types=geocode&key=' + _config.google.apiKey, function (err, resp, body){
                    if (err)
                        reply({statusCode: 500, error: err});
                    else
                        reply({statusCode: 200, data :JSON.parse(body).predictions});
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/geocity/import',
        config: {
            handler: function (request, reply){
                geoCity.importGeoCityData(function(response){
                    console.log("Done migrating geocity data.");
                });
                reply('Importing data');
            }
        }
    }
];