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