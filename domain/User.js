"use strict";

var mongoose = require('mongoose');

//Define User Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    roles: [],
    location: {
        address1: String,
        address2: String,
        code: String,
        city: String,
        country: String
    },
    personalDetails: {
        age: {type: Number, min: 18, max: 120},
        phone: Number,
        gender: String,
        profileImage: String
    },
    posts: [],
    shortlisted : [],
    isActive: Boolean,
    verified: Boolean,
    timestamp: {type: Number, default: +new Date()},
    loginToken: {type: String},
    lastSearchedLocation : {
        seoFriendlyName : String
    }
};
