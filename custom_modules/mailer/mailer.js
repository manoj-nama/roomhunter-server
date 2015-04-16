var ejs = require('ejs');
var fs = require('fs');
var transporter = require('./lib/transport').transporter;

exports.send = function(to, subject, templateName, data, from){
    if(from){
        from = from + 'RoomHunt Notifications';
    } else {
        from = 'RoomHunt Notifications';
    }

    if(templateName){
        _getCompiledTemplate(templateName, data, function(template){
            if(template){
                _sendMail(from, to, subject, template, data);
            }
        });
    }
};


function _getCompiledTemplate(templateName, data, callback){
    var templatePath = __appBaseDir + '/views/emailTemplates/' + templateName + '.ejs';
    fs.readFile(templatePath, {'encoding': 'utf-8'}, function(err, str){
        if(err){
            log.error("Error fetching email template.");
            callback(null);
        }
        var template = ejs.render(str, data);
        callback(template);
    });
}

function _sendMail(from, to, subject, template, data){
    var mailObj = {
        from: from,
        to: to,
        subject: subject,
        html: template
    };
    transporter.sendMail(mailObj, function(err, info){
        log.info(err, info);
    })
}
