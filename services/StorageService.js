var fs = require('fs');
var EventName = require('../src/enum/EventName');

module.exports.upload = function (file){
    var emitter = this;
    if (file) {
        var name = (+new Date()) + file.hapi.filename;
        var path = __appBaseDir + "/uploads/" + name;
        var image = fs.createWriteStream(path);

        image.on('error', function (err){
            console.error(err)
        });

        file.pipe(image);

        file.on('end', function (err){
            if (err)
                emitter.emit(EventName.ERROR, err);
            else
                emitter.emit(EventName.DONE,{path : name });
        })
    }
}.toEmitter();