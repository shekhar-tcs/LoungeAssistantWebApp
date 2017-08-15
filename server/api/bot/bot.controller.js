'use strict';

var botService = require('../../service/bot.service');
var config = require('../../config/environment');
var webServiceManager = require('../../managers/webservice.manager');
/**
 * Listen to BotFramework WebHook
 * POST /
 *
 * @param req
 * @param res
 */
exports.listen = function () {
    botService.listen(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Bot Connector Listening to " + config.botFrameworkWebHook + ' endpoint');
    });
};


exports.testWebserviceManager = function (req, res) {
    var data =  {
        v: "20161016",
        ll: "41.878114,-87.629798",
        query: "coffee",
        intent: "checkin",
        client_id: "RKX10D25RWFKR1GCOKDOZIXZTM0PSLXEMWC4MWFXOMIOKSV3",
        client_secret: "5A5B5MPRG1LW1SG5ZZU2FXGPK1QYWKZWP2ZR5EIYHSOFJFAI"
    }

    webServiceManager.get("https://api.foursquare.com/v2/venues/search", null, data)
        .then(function (response) {
            res.json(200, response);
        }, function (err) {
            return res.send(500, err);
        });
};

