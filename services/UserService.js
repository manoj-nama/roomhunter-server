var EventName = require('../src/enum/EventName');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var mail = require("../custom_modules/mailer");
var utils = require('../src/Utils');


module.exports.login = function (request) {
    var emitter = this;
    log.info(request.auth);
    if (request.auth && request.auth.credentials.email) {
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
                bcrypt.hash(user.password, 10, function (err, hash) {
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    }
                    else {
                        user.password = hash;
                        new Modal.User(user).save(function (err, result) {
                            if (err) {
                                emitter.emit(EventName.ERROR, err);
                            }
                            else {
                                var link = getVerificationLink(result._id);
                                mail.send(result.email, "Verify your RoomHunt account", "emailVerification", {email : result.email,link : link});
                                emitter.emit(EventName.DONE, {
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email
                                });
                            }
                        })
                    }
                });
            }
        }
    );

}.toEmitter();

module.exports.update = function (_id, user) {
    var emitter = this;
    Modal.User.findOne({_id: _id},
        function (err, result) {
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                Modal.User.update({_id: mongoose.Types.ObjectId(_id)}, {$set: user}, {}, function (err, result) {
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


module.exports.getUserByEmail = function (email) {
    var emitter = this;
    Modal.User.findOne({email: email}, function (err, user) {
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

module.exports.delete = function (id) {
    var emitter = this;
    Modal.User.remove({_id: mongoose.Types.ObjectId(id)}, function (err, result) {
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

function getVerificationLink(userId) {
    var encryptedData = utils.encrypt(JSON.stringify({userId: userId}));
    var link = _config.server.serverUrl + "/verify/" + encryptedData;
    console.log(link);
    return link;
}

