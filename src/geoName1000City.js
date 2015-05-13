var url = require("url");
var http = require("http");
var AdmZip = require('adm-zip');
var bufferUtils = require("../custom_modules/bufferUtils");
var fs = require("fs");

var downloadFile = function (obj, callback){
    var interval;
    try {
        var host = url.parse(obj.cities1000FilePath).hostname;
        var request = http.createClient(80, host).request('GET', obj.cities1000FilePath, {"host": host});
        request.end();
        var downloadedBytes = 0;
        var totalBytes = 0;
        var body = '';
        var alternateNamesFiles = '';
        var cityFileDownloaded = false;

        function downloadComplete(){
            if (cityFileDownloaded) {
                clearInterval(interval);
                updateProgress();
                callback(body);
            }
        }

        var updateProgress = function (){
            console.log("totalBytes : " + totalBytes + ", downloadedBytes : " + downloadedBytes + ", Total Downloaded : " + (downloadedBytes / totalBytes * 100) + "%")
        };
        interval = setInterval(updateProgress, 1500);
        request.addListener('response', function (response){
            response.setEncoding('binary');
            totalBytes += parseInt(response.headers['content-length'], 10);
            response.addListener('data', function (chunk){
                downloadedBytes += chunk.length;
                body += chunk;
            });
            response.addListener("end", function (){
                cityFileDownloaded = true;
                downloadComplete();
            });
        });
    } catch (c) {
        console.log("error occured in downloading geocity files and error is : " + c);
        clearInterval(interval);
    }
};

var unzipFiles = function (body){
    var zip = new AdmZip(new Buffer(body, 'binary'));
    var files = {};
    zip.getEntries().forEach(function (entry){
        files[entry.entryName.toString().split("/").pop()] = zip.readFile(entry);
    });
    return files;
};

function syncGeoNameFilesToDB(files, callback){
    var alternateNames = {}, cityIds = {};

    var count = 0;
    var recordsSaved = 0;
    var updateJobCard = function (callback){
        console.log(">>>>>>>>>>>>>>>>> Records Processed : " + recordsSaved);
        callback();
    };
    var jobCompleted = function (){
        //asyncLoop.emit("next", reader.readLine());
    };

    (function (){
        try {
            var reader = new bufferUtils.BufferedReader(files['cities1000.txt'], 'utf8');
            (function saveRecord(){
                var line = reader.readLine();
                if (line) {
                    var arr = line.replace(/\t/g, "|--|").split('|--|');
                    if ((arr || []).length == 19 && (arr[8].replace(/"|'/g, "") == "IN")) {
                        cityIds[parseInt(arr[0].replace(/"|'/g, ""), 10)] = true;
                        new Model.GeoCity({
                            geoId: parseInt(arr[0].replace(/"|'/g, ""), 10),
                            name: arr[1].replace(/"|'/g, "").toString("utf8"),
                            latitude: parseFloat(arr[4].replace(/"|'/g, "")),
                            longitude: parseFloat(arr[5].replace(/"|'/g, "")),
                            loc: {
                                type: "Point",
                                coordinates: [parseFloat(arr[5].replace(/"|'/g, "")), parseFloat(arr[4].replace(/"|'/g, ""))]
                            },
                            featureClass: arr[6].replace(/"|'/g, ""),
                            featureCode: arr[7].replace(/"|'/g, ""),
                            countryCode: arr[8].replace(/"|'/g, ""),
                            cc2: arr[9].replace(/"|'/g, ""),
                            admin1Code: arr[10].replace(/"|'/g, ""),
                            admin2Code: arr[11].replace(/"|'/g, ""),
                            admin3Code: arr[12].replace(/"|'/g, ""),
                            admin4Code: arr[13].replace(/"|'/g, ""),
                            seoFriendlyName: arr[1].replace(/"|'/g, "") + "-" + arr[3].replace(/"|'/g, "") + "-" + arr[1].replace(/"|'/g, ""),
                            population: isNaN(parseInt(arr[14].replace(/"|'/g, ""), 10)) ? 0 : parseInt(arr[14].replace(/"|'/g, ""), 10),
                            elevation: isNaN(parseInt(arr[15].replace(/"|'/g, ""), 10)) ? 0 : parseInt(arr[15].replace(/"|'/g, ""), 10),
                            dem: isNaN(parseInt(arr[16].replace(/"|'/g, ""), 10)) ? 0 : parseInt(arr[16].replace(/"|'/g, ""), 10),
                            timezone: arr[17].replace(/"|'/g, ""),
                            modificationDate: arr[18].replace(/"|'/g, ""),
                            isUpdated: true
                        }).save(function (){
                                recordsSaved++;
                                updateJobCard(function (){
                                    setImmediate(function (){
                                        saveRecord();
                                    });
                                });
                            });
                    } else {
                        setImmediate(function (){
                            saveRecord();
                        });
                    }
                }
                else{
                    callback();
                }
            })();
        } catch (c) {
            console.log(c, "@@@@@@@@@@@@@@@@@@@@");
        }
    })();
}

exports.importGeoCityData = function (callback){
    var obj = {
        cities1000FilePath: "http://download.geonames.org/export/dump/cities1000.zip"
    };
    downloadFile(obj, function (body){
        var files = unzipFiles(body);
        syncGeoNameFilesToDB(files, function (){
            console.log("Completed!");
            callback(null, "SUCCESS");
        });
    });
};
