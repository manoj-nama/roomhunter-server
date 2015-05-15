var EventName = require('../src/enum/EventName');
var mongoose = require('mongoose');
var utils = require('../src/Utils');

module.exports.create = function (room){
    var emitter = this;
    room.isActive = true;
    room.createdAt = +new Date();
    new Model.Room(room).save(function (err, result){
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else {
            emitter.emit(EventName.DONE, result);
        }
    })
}.toEmitter();


module.exports.get = function (id){
    var emitter = this;
    Model.Room.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, room){
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (room) {
            emitter.emit(EventName.DONE, room);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();

module.exports.update = function (_id, room){
    var emitter = this;
    Model.Room.findOne({_id: _id},
        function (err, result){
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                Model.Room.update({_id: mongoose.Types.ObjectId(_id)}, {$set: room}, {}, function (err, result){
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

module.exports.delete = function (id){
    var emitter = this;
    Model.Room.remove({_id: mongoose.Types.ObjectId(id)}, function (err, result){
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

module.exports.getRoomsByUserId = function (userId){
    var emitter = this;
    Model.Room.find({userId: userId}, function (err, rooms){
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

//Todo apply paginated response for lazy loading

module.exports.getRoomsByCriteria = function (location, filters){
    var emitter = this;

    if (location == '') {
        Model.Room.find({}, {}, {sort: {createdAt: -1}}, function (err, rooms){
            if (err) {
                emitter.emit(EventName.ERROR, err);
            }
            else if (rooms) {
                emitter.emit(EventName.DONE, rooms);
            }
            else {
                emitter.emit(EventName.NOT_FOUND, []);
            }
        });
    }
    else {
        var criteria = utils.parseFilterUrl(filters);
        criteria['location.seoFriendlyName'] = location;
        Model.Room.find(criteria, function (err, rooms){
            if (err) {
                emitter.emit(EventName.ERROR, err);
            }
            else if (rooms) {
                emitter.emit(EventName.DONE, rooms);
            }
            else {
                emitter.emit(EventName.NOT_FOUND, []);
            }
        });
    }
}.toEmitter();

