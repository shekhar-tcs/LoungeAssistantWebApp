/**
 * Created by leon on 17/3/17.
 */
'use strict';

var config = {
    mailgun:{
        api_key : 'key-e494aa0b7566d5a4ee803f452ba3691b',
        domain: 'mg.themrolab-singapore.com',
        form: 'do-not-reply@themrolab-singapore.com',
        senderName: 'the MRO Lab Singapore'
    }
};
var fs = require('fs');
var api_key = config.mailgun.api_key;
var domain = config.mailgun.domain;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var from = config.mailgun.form;
var ejs = require('ejs');

var sendText = function (to, subject, text) {
    var data = {
        from: config.mailgun.senderName+ ' <' + from + '>',
        sender: config.mailgun.senderName+ ' <' + from + '>',
        to: to,
        subject: subject,
        text: text
    };
    mailgun.messages().send(data, function (error, res) {
        if(error){
            console.log(error);
        }else{
            console.log("emails sent:", res);
        }
    });
};

var sendHtml = function (to, subject, htmlPath, paramObj) {
    var ejsFile = fs.readFileSync(htmlPath, 'utf8');
    var html = ejs.render(ejsFile, paramObj);
    var data = {
        from: config.mailgun.senderName+ ' <' + from + '>',
        sender: config.mailgun.senderName+ ' <' + from + '>',
        to: to,
        subject: subject,
        html: html
    };

    mailgun.messages().send(data, function (error, res) {
        if(error){
            console.log(error);
        }else{
            console.log("emails sent:", res);
        }

    });
};

exports.sendHtml = sendHtml;

exports.sendText = sendText;
