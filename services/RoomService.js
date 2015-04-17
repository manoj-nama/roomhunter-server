var EventName = require('../src/enum/EventName');
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


module.exports.get = function (id) {
    var emitter = this;
    Modal.Room.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, room) {
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (user) {
            emitter.emit(EventName.DONE, room);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();

module.exports.update = function (_id, room) {
    var emitter = this;
    Modal.Room.findOne({_id: _id},
        function (err, result) {
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                Modal.Room.update({_id: mongoose.Types.ObjectId(_id)}, {$set: room }, {}, function (err, result) {
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    }
                    else {
                        emitter.emit(EventName.DONE, true);
                    }
                });
            }
        });
}.toEmitter();


module.exports.delete = function (id) {
    var emitter = this;
    Modal.Room.remove({_id: mongoose.Types.ObjectId(id)}, function (err, result) {
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (result) {
            emitter.emit(EventName.DONE, true);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();

module.exports.getRoomsByUserId = function (userId) {
    var emitter = this;
    Modal.Room.find({userId: userId}, function (err, rooms) {
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (user) {
            emitter.emit(EventName.DONE, rooms);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, []);
        }
    });
}.toEmitter();