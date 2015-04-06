"use strict";

var fs = require('fs'),
    traceurAPI = require("traceur"),
    path = require('path'),
    mkdirp = require('mkdirp');

module.exports = function (appDirectoryPath, debugFlag) {
    var tmpPath = path.join(appDirectoryPath, 'custom_modules', 'es6Support', 'temp');

    //temp folder created
    mkdirp(tmpPath, function (err) {
        if (err) {
            log.error(err);
        }
    });

    function init(filePath) {
        var srcPath = filePath,
            fileName = path.basename(srcPath),
            destPath = tmpPath + '/' + fileName,
            preDestPath = destPath.replace(fileName,''),
            contents = fs.readFileSync(srcPath).toString(),
            newDestinationPath = preDestPath + +new Date() + '_' + fileName,
            sourceMap;

        // Create a compiler with your options
        var compiler = new traceurAPI.NodeCompiler({
            sourceMaps: true,
            // etc other Traceur options
            modules: 'commonjs'
        });
        // Transcode some source.
        var compiled = compiler.compile(contents, srcPath, destPath);
        //Enable Debug Flag
        if (debugFlag === true) {
            log.info('ECMA6: ', compiled);
        }

        // Retrieve the sourcemap.
        sourceMap = compiler.getSourceMap();

        fs.writeFileSync(newDestinationPath, compiled);
        fs.writeFileSync(newDestinationPath + '.map', sourceMap);

        return require(newDestinationPath);
    }

    function clear() {
        process.on('SIGINT', function () {
            var dirList = fs.readdirSync(tmpPath);
            dirList.forEach(function (fileName) {
                fs.unlinkSync(tmpPath + '/' + fileName)
            });
            log.info('ECMA6 temp files removed');
        });
    }

    return {
        init: init,
        clear: clear
    }
};



