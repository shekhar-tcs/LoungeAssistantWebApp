var util = require('util');
var builder = require('botbuilder');
var mainMenuOptions;

var lib = new builder.Library('greet');
lib.dialog('checkedIn', [
    function (session) {
        sendGreetingMessage(session, "UncheckedIn");
    }
]);

lib.dialog('uncheckedIn', [
    function (session) {
        sendGreetingMessage(session, "UncheckedIn");
    }
]);

var sendGreetingMessage = function (session, type) {
    var title;
    var subtitle;
    var images = [];
    var optionsButtons = [
        builder.CardAction.imBack(session, session.gettext(mainMenuOptions.serviceCatalog), session.gettext(mainMenuOptions.serviceCatalog)),
        builder.CardAction.imBack(session, session.gettext(mainMenuOptions.support), mainMenuOptions.support)
    ];
    var welcomeCard = new builder.HeroCard(session);
    switch (type) {
        case "UncheckedIn":
            title = session.gettext('welcome_title');
            subtitle = "welcome_subtitle";
            var checkinButton =  builder.CardAction.imBack(session, session.gettext(mainMenuOptions.checkIn), mainMenuOptions.checkIn);
            optionsButtons.splice(0, 0, checkinButton);
            var logoImage = new builder.CardImage(session)
                .url('https://sia-loungeassistant-images.imgix.net/krisflyer-loungeassistant.png')
                .alt('sia_lounge_assistant');
            images.push(logoImage);
            break;
        case "CheckedIn":
            var currentUsername = session.userData.currentUser.name;
            title = session.gettext('welcome_back_title', currentUsername);
            subtitle = "welcome_back_subtitle";
            break;
    }
    welcomeCard
        .title(title)
        .subtitle(subtitle)
        .images(images)
        .buttons(optionsButtons);

    session.endDialog(new builder.Message(session)
        .addAttachment(welcomeCard))
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports.greetUser = function (session, menuOptions) {
    mainMenuOptions = menuOptions;
    if (session.userData.currentUser) {
        return session.beginDialog('greet:checkedIn');
    } else {
        return session.beginDialog('greet:uncheckedIn');
    }
}