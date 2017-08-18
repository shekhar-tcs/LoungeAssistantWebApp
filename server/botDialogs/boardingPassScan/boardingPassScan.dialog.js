/**
 *
 */
var config = require('./../../../config/env/index');
var builder = require('botbuilder');
var userManager = require('./../../../serviceManager/loginManager/user.manager.js');
var index = require('./../../../index.json');
var dialogManager = require('./../../../serviceManager/dialogsManager/dialogManager');

exports.login = [
    function (session, args) {
        //prompt ask username and password with a format
        if(!args.reprompt){
            builder.Prompts.text(session, "Please provide your username and password by following the format \'-username -password\'");
        } else {
            builder.Prompts.text(session, "Please try again. Please follow the format '-username -password'");
        }

    }, function (session, results) {
        //user serviceManager to loginManager with a return json object for both success and fail cases
        var resultsArray = results.response.split(' ');
        var user = {};
        user.username = resultsArray[0];
        user.password = resultsArray[1];
        //prompt
        userManager.userLogin(user)
            .then(function (token) {
                session.userData.token = token;
                dialogManager.toPreMenu(session);


            }, function (err) {
                session.userData = {};
                // reprompt loginManager
                session.replaceDialog(index.login, {reprompt: true});

            });
    }

];