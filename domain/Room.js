"use strict";

var mongoose = require('mongoose');

//Define Room Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    title: String,
    userId: String,
    isActive: Boolean,
    timeStamp: Date,
    location: {
        name: String,
        city: String,
        country: String,
        code: String,
        longitude: String,
        latitude: String,
        seoFriendlyUrl: String
    },
    description: String,
    price: Number,
    propertyType: String,
    isFurnished: Boolean,
    images:[]
};
