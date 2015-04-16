var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
        user: "postmaster@sandbox9487e25e569a4b72a9b7ac0a7d060f6c.mailgun.org" ,
        pass: "794b30cd39fd1f0286e1ac797cb2b1ec"
    }
});

exports.nodemailer = nodemailer;
exports.transporter = transporter;