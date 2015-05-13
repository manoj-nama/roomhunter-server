"use strict";

var mongoose = require('mongoose');

//Define GeoCity Schema
//Refer: http://mongoosejs.com/docs/schematypes.html
module.exports = {
    geoId: Number,
    name: String,
    alternateNames: {},
    latitude: Number,
    longitude: Number,
    "loc": {
        "type": {type: String, default: "Point"},
        "coordinates": Array             // lng, lat
    },
    featureClass: String,
    featureCode: String,
    countryCode: String,
    cc2: String,
    admin1Code: String,
    admin2Code: String,
    admin3Code: String,
    admin4Code: String,
    population: Number,
    elevation: Number,
    dem: Number,
    timezone: String,
    modificationDate: String,
    isUpdated: Boolean
};

