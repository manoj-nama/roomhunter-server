var EventName=require('../src/enum/EventName');

module.exports.createUser = function (request){
    var emitter = this;
    if(request.auth && request.auth.credentials.name){
        emitter.emit(EventName.DONE,  request.auth.credentials);
    }else{
        emitter.emit(EventName.ERROR, "ERROR");
    }
}.toEmitter();