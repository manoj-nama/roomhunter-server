var fs = require('fs');
var EventName = require('../src/enum/EventName');
var async = require('async');

module.exports.upload = function (files){
    var emitter = this;
    if(!(files instanceof Array)){
        files = [files];
    }
   if (files && files.length) {
        var tasks = [];
        files.forEach(function (file){
            tasks.push(function (cb){
                uploadImage(file,cb);
            });
        });
        async.parallel(tasks, function(err, result){
            if(err)
            emitter.emit(EventName.ERROR, err);
            else
                emitter.emit(EventName.DONE, result);
        });
    }
}.toEmitter();

function uploadImage(file,cb){
    var name = (+new Date()) + file.hapi.filename;
    var path = __appBaseDir + "/uploads/" + name;
    var image = fs.createWriteStream(path);

    image.on('error', function (err){
        cb(err);
    });

    file.pipe(image);

    file.on('end', function (err){
        cb(err, name);
    })
}