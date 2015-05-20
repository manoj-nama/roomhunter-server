var EventName = require('../src/enum/EventName');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var mail = require("../custom_modules/mailer");
var utils = require('../src/Utils');
var jwt = require('jsonwebtoken');

module.exports.login = function (userCredential){
    var emitter = this;
    Model.User.findOne({
            'email': userCredential.email
        }, function (err, userObj){
            if (userObj && userObj.email) {
                if (userObj.verified) {
                    bcrypt.compare(userCredential.password, userObj.password, function (err, res){
                        if (res == true) {
                            userObj.password = null;
                            var token = jwt.sign({password: userObj.password, email: userObj.email}, "h(3#");
                            Model.User.update({'email': userObj.email}, {$set: {loginToken: token}}, function (err, tokenUpdated){
                                if (err) {
                                    emitter.emit(EventName.ERROR, "ERROR");
                                } else if (tokenUpdated) {
                                    emitter.emit(EventName.DONE, {
                                        firstName: userObj.firstName,
                                        lastName: userObj.lastName,
                                        loginToken: token,
                                        userId: userObj._id,
                                        lastSearchedLocation:userObj.lastSearchedLocation
                                    });
                                } else {
                                    emitter.emit(EventName.ERROR, "loginToken not created");
                                }
                            });
                        } else {
                            emitter.emit(EventName.ERROR, "Invalid Password");
                        }
                    });
                }
                else
                    emitter.emit(EventName.ERROR, "Account not verified.");
            } else {
                emitter.emit(EventName.ERROR, "Email Id not found");
            }
        }
    );
}.toEmitter();

module.exports.create = function (user){
    var emitter = this;
    Model.User.findOne({email: user.email},
        function (err, result){
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                emitter.emit(EventName.ALREADY_EXIST, {});
            }
            else {
                bcrypt.hash(user.password, 10, function (err, hash){
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    }
                    else {
                        user.password = hash;
                        new Model.User(user).save(function (err, result){
                            if (err) {
                                emitter.emit(EventName.ERROR, err);
                            }
                            else {
                                var link = getVerificationLink(result._id);
                                mail.send(result.email, "Verify your RoomHunt account", "emailVerification", {
                                    email: result.email,
                                    link: link
                                });
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

module.exports.update = function (_id, user){
    var emitter = this;
    Model.User.findOne({_id: _id},
        function (err, result){
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                Model.User.update({_id: mongoose.Types.ObjectId(_id)}, {$set: user}, {}, function (err, result){
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

module.exports.logout = function (_id){
    var emitter = this;
    Model.User.findOneAndUpdate({_id: _id}, {$unset: {loginToken: 1}},
        function (err, numberAffected, raw){
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else
                emitter.emit(EventName.DONE, true);
        });
}.toEmitter();

module.exports.get = function (id){
    var emitter = this;
    Model.User.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, user){
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (user) {
            console.log('user',user)
            emitter.emit(EventName.DONE, user);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();

module.exports.getUserByEmail = function (email){
    var emitter = this;
    Model.User.findOne({email: email}, function (err, user){
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

module.exports.delete = function (id){
    var emitter = this;
    Model.User.remove({_id: mongoose.Types.ObjectId(id)}, function (err, result){
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

module.exports.verifyUser = function (code){
    var emitter = this;
    var decryptedData = JSON.parse(utils.decrypt(code));
    if (decryptedData && decryptedData.userId) {
        Model.User.findOneAndUpdate({_id: mongoose.Types.ObjectId(decryptedData.userId)}, {$set: {verified: true}}, {new: true}, function (err, user){
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
    }
    else
        emitter.emit(EventName.NOT_FOUND, null);
}.toEmitter();

module.exports.sendMessage = function (to, from, message){
    var emitter = this;
    mail.send(to, "New message: RoomHunt", "sendMessage", {
        toEmail: to,
        fromEmail: from,
        message: message
    });
    emitter.emit(EventName.DONE, null);
}.toEmitter();

module.exports.shortlistRoom = function (userId, roomId){
    var emitter = this;
    Model.User.update({_id: userId}, {$addToSet: {"shortlisted": roomId}},
        function (err, numberAffected){
            if (err) {
                emitter.emit(EventName.ERROR, err);
            }
            else {
                emitter.emit(EventName.DONE, true);
            }
        });
}.toEmitter();

module.exports.removeFromshortlisted = function (userId, roomId){
    var emitter = this;
    Model.User.update({_id: userId}, {$pull: {"shortlisted": roomId}},
        function (err, numberAffected){
            if (err) {
                emitter.emit(EventName.ERROR, err);
            }
            else {
                emitter.emit(EventName.DONE, true);
            }
        });
}.toEmitter();

module.exports.sendResetPasswordLink = function (email){
    var emitter = this;
    Model.User.findOne({email: email}, function (err, user){
        if (err) {
            emitter.emit(EventName.ERROR, err);
        }
        else if (user) {
            var link = getResetPasswordLink(user._id);
            mail.send(email, "Reset Your Room-Hunt Password", "resetPassword", {
                email: email,
                link: link
            });
            emitter.emit(EventName.DONE, email);
        }
        else {
            emitter.emit(EventName.NOT_FOUND, null);
        }
    });
}.toEmitter();

module.exports.verifyResetPasswordLink = function (code){
    var emitter = this;
    var decryptedData = JSON.parse(utils.decrypt(code));
    if (decryptedData && decryptedData.userId) {
        Model.User.findOne({_id: mongoose.Types.ObjectId(decryptedData.userId)}, function (err, user){
            if (err) {
                emitter.emit(EventName.ERROR, err);
            }
            else if (user) {
                emitter.emit(EventName.DONE, user._id);
            }
            else {
                emitter.emit(EventName.NOT_FOUND, null);
            }
        });
    }
    else
        emitter.emit(EventName.NOT_FOUND, null);
}.toEmitter();

module.exports.updatePassword = function (_id, password){
    var emitter = this;
    Model.User.findOne({_id: _id},
        function (err, result){
            if (err) {
                log.error("ERROR: ", err);
                emitter.emit(EventName.ERROR, err);
            }
            else if (result) {
                bcrypt.hash(password, 10, function (err, hash){
                    if (err) {
                        emitter.emit(EventName.ERROR, err);
                    }
                    else {
                        Model.User.update({_id: mongoose.Types.ObjectId(_id)}, {$set: {password: hash}}, {}, function (err, result){
                            if (err) {
                                emitter.emit(EventName.ERROR, err);
                            }
                            else {
                                emitter.emit(EventName.DONE, true);
                            }
                        });
                    }
                });
            }
            else
                emitter.emit(EventName.NOT_FOUND, null);
        });
}.toEmitter();

function getVerificationLink(userId){
    var encryptedData = utils.encrypt(JSON.stringify({userId: userId}));
    var link = _config.server.clientUrl + "#/verify/" + encryptedData;
    console.log(_config.server.clientUrl + "#/verify/" + encryptedData);
    return link;
}

function getResetPasswordLink(userId){
    var encryptedData = utils.encrypt(JSON.stringify({userId: userId, timeStamp: +new Date()}));
    var link = _config.server.clientUrl + "#/reset/password/" + encryptedData;
    console.log(_config.server.clientUrl + "#/reset/password/" + encryptedData);
    return link;
}

