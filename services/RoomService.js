var EventName = require('../src/enum/EventName');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

module.exports.create = function (room) {
    var emitter = this;
    room.isActive = true;
    new Modal.Room(room).save(function (err, result) {
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else {
            emitter.emit(EventName.DONE, result);
        }
    })
}.toEmitter();