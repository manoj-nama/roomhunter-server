var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


exports.encrypt = function (text){
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (text){
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.parseFilterUrl = function (filters){
    var criteria = {};
    for (var key in filters) {
        if (filters.hasOwnProperty(key)) {
            switch (key) {
                case 'price' :
                    var pricesRange = filters[key].split('_');
                    criteria['price'] = {'$gte': Number(pricesRange[0]), '$lte': Number(pricesRange[1])};
                    break;
                case 'fur' : criteria['isFurnished'] = (filters[key] === "true"); break;
                case 'type' : criteria['propertyType'] = filters[key]; break;
            }
        }
    }
    return criteria;

};