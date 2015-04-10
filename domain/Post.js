"use strict";

var mongoose = require('mongoose')

//Define Post Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    title: String,
    userId: String,
    isActive: Boolean,
    timeStamp: Date,
    location: {
        name: String,
        Address1: String,
        Address2: String,
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
    roommate_preference: String,
    isFurnished: Boolean,
    images:[]
};
