"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Define User Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    username: String,
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
        phone: Number,
        gender: String,
        profileImage: String
    },
    posts: [],
    isActive: Boolean,
    timestamp: {type: Number, default: +new Date()}
};