var EventName = require('../src/enum/EventName');
var mongoose = require('mongoose');


module.exports.login = function (request) {
    var emitter = this;
    log.info(request.auth);
    if (request.auth && request.auth.credentials.name) {
        emitter.emit(EventName.DONE, request.auth.credentials);
    } else {
        emitter.emit(EventName.ERROR, "ERROR");
    }
}.toEmitter();


module.exports.create = function (user) {
    var emitter = this;
    Modal.User.findOne({email: user.email},
        function (err, result) {
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                emitter.emit(EventName.DONE, user);
            }
            else {
                new Modal.User(user).save(function (err, result) {
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    }
                    else {
                        emitter.emit(EventName.DONE, {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        });
                    }
                })
            }
        }
    );

}.toEmitter();


module.exports.get = function (id) {
    var emitter = this;
    Modal.User.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, user) {
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (user) {
            emitter.emit(EventName.DONE, user);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();