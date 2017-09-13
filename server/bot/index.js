var builder = require('botbuilder');
var siteUrl = require('./site-url');
var config = require('../config/environment');
var greetDialog = require('./dialogs/greet');
var scanBoardingPassDialog = require('./dialogs/scanBoardingPass');
var serviceCatalogDialog = require('./dialogs/service-catalog');
var settingsDialog = require('./dialogs/settings');
var helpDialog = require('./dialogs/help');
var mainMenuDialog = require('./dialogs/main-menu');
var checkInDialog = require('./dialogs/checkIn');
var localizedRegexHelper = require('./dialogs/helpers/localizedRegex.helper');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID || config.bot.appId,
    appPassword: process.env.MICROSOFT_APP_PASSWORD || config.bot.appPassword
});


var bot = new builder.UniversalBot(connector, function (session) {
    handleRootDialogMessages(session);
});

// Add global LUIS recognizer to bot
var luisAppUrl = process.env.LUIS_APP_URL || config.bot.luisEndpoint;
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

// Enable Conversation Data persistence
bot.set('persistConversationData', true);

// Set default locale
bot.set('localizerSettings', {
    botLocalePath: __dirname + '/locale',
    defaultLocale: 'en'
});

var handleRootDialogMessages = function (session) {
    //Captures message in root dialog
    if (mainMenuDialog.handleMainMenuOptions(session)) return;

    // if not anything else "Greet" the user
    greetDialog.greetUser(session, mainMenuDialog.menuOptions);
}

// Sub-Dialogs
bot.library(mainMenuDialog.createLibrary());
bot.library(checkInDialog.createLibrary());
bot.library(greetDialog.createLibrary());
bot.library(scanBoardingPassDialog.createLibrary());
bot.library(serviceCatalogDialog.createLibrary());
bot.library(settingsDialog.createLibrary());
bot.library(helpDialog.createLibrary());

// Validators
bot.library(require('./validators').createLibrary());

// Trigger secondary dialogs when 'settings' or 'support' is called
bot.use({
    botbuilder: function (session, next) {

        //Captures message in root dialog
        var message = session.message.text;

        var settingsRegex = localizedRegexHelper.getRegex(session, ['main_options_settings']);
        if (settingsRegex.test(message)) {
            // Trigger 'settings' dialog
            return session.beginDialog('settings:/');
        }

        var supportRegex = localizedRegexHelper.getRegex(session, ['main_options_talk_to_support', 'help']);
        if (supportRegex.test(message)) {
            // Trigger 'help' dialog
            return session.replaceDialog('help:/');
        }

        // continue normal flow
        next();
    }
});

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.dialog('goBack', [
    function (session, args, next) {
        // Resolve and store any Note.Title entity passed from LUIS.
        session.endDialog();
    }
]).triggerAction({
    matches: 'Utilities.Goback'
});




// Connector listener wrapper to capture site url
var connectorListener = connector.listen();
function listen() {
    return function (req, res) {
        // Capture the url for the hosted application
        // We'll later need this url to create the checkout link 
        var url = req.protocol + '://' + req.get('host');
        siteUrl.save(url);
        connectorListener(req, res);
    };
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
}

function sendMessage(message) {
    bot.send(message);
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};