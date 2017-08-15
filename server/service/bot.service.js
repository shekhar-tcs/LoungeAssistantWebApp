
var builder = require('botbuilder')
var config = require('../config/environment');

var connector = new builder.ChatConnector({
    appId: config.bot.appId,
    appPassword: config.bot.appPassword
});

var bot = new builder.UniversalBot(this.connector);
bot.recognizer(new builder.LuisRecognizer(config.luisEndpoint));

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

exports.listen = function(callback) {
    if (!connector) {
        var err = new Error("Connector not instantiated")
        callback(err);
    } else {
        connector.listen();
        callback(null);
    }

}