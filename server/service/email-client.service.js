var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shekhar@myaango.com',
        pass: 'shekharsasikumar8'
    }
});

var mailOptions = {
    from: 'shekhar@myaango.com', // sender address
    to: 'shekhar.sasikumar@capgemini.com', // list of receivers
    subject: 'Anomaly Alert: There is a temperature surge detected at device #PET-123', // Subject line
    html: '<p>We have detected an anomaly</p>'// plain text body
};

exports.sendEmail = function () {
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}