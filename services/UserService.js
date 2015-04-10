
exports.createUser = function (request, reply){
    reply('hello, ' + request.auth.credentials.name);
};