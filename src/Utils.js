var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


exports.encrypt = function (text){
    var cipher = crypto.createCipher(algorithm, password);
    try {
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    catch (e) {
        return null;
    }

};

exports.decrypt = function (text){
    var decipher = crypto.createDecipher(algorithm, password);
    try {
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    catch (e) {
        return null;
    }

};

exports.parseFilterUrl = function (filters){
    var criteria = {};
    var offset = 0;
    for (var key in filters) {
        if (filters.hasOwnProperty(key)) {
            switch (key) {
                case 'price' :
                    if (filters[key]) {
                        var pricesRange = filters[key].split('_');
                        criteria['price'] = {'$gte': Number(pricesRange[0]), '$lte': Number(pricesRange[1])};
                    }
                    break;
                case 'fur' :
                    if (filters[key]) {
                        criteria['isFurnished'] = (filters[key] === "true");
                    }
                    break;
                case 'type' :
                    if (filters[key]) {
                        criteria['propertyType'] = {$in: filters[key].split('_')};
                    }
                    break;
                case 'offset' :
                    offset = filters[key];
                    break;
            }
        }
    }
    return {criteria: criteria, offset: offset};
};
