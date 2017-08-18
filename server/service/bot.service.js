
var builder = require('botbuilder')
var config = require('../config/environment');

var connector = new builder.ChatConnector({
    appId: config.bot.appId,
    appPassword: config.bot.appPassword
});

var bot = new builder.UniversalBot(connector);
bot.recognizer(new builder.LuisRecognizer(config.luisEndpoint));

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault([
    function (session, args, next) {
        var token = session.userData.token;
        // session.beginDialog('/loginManager', {reprompt: false});
        if (token == undefined) {
            session.beginDialog(index.login, {reprompt: false});
        } else {
            next();
        }
    },
    function (session) {
        if (session.userData.token == undefined) {
            //session.send('Your bot hasn\'t been activated yet, please register it with your professional email account by typing \'register\'');
            session.beginDialog(index.login, {reprompt: false});
        } else {
            //menuBot.menu(bot);
            session.replaceDialog(index.menu.preMenu);
        }
    }
]);


intents.matches('/(hi|hello|morning|afternoon)/i', function (session) {
    if (session.userData.token == undefined) {
        //session.send('Your bot hasn\'t been activated yet, please register it with your professional email account by typing \'register\'');
        session.beginDialog(index.login, {reprompt: false});
    } else {
        //menuBot.menu(bot);
        session.beginDialog(index.menu.preMenu);
    }
})

exports.bot = bot;
exports.connector = connector;