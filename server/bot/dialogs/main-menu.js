var util = require('util');
var builder = require('botbuilder');
var localizedRegexHelper = require('./helpers/localizedRegex.helper');

var lib = new builder.Library('main-menu');
lib.dialog('/', [
    function (session) {
        // Ask to scan the QR code using 'scanBoardingPass' library
        session.send("Sure");
        session.beginDialog('scanBoardingPass:/',
            {
                promptMessage: session.gettext('scan_boarding_pass')
            });
    },
    function (session, args) {
        if (args.booking) {
            session.userData.currentUser = args.booking.passenger;
            if (!session.userData.users) session.userData.users = {};
            session.userData.users[args.booking.passenger.passportNumber] = args.booking.passenger;
            session.send()
            session.beginDialog('service-catalog:/');
        } else {

        }

    }
]);

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports.handleMainMenuOptions = function (session) {

    var message = session.message.text;

    var checkInRegex = localizedRegexHelper.getRegex(session, [session.gettext(this.menuOptions.checkIn)]);
    if (checkInRegex.test(message)) {
        // Check In with boarding Pass
        return session.beginDialog('checkIn:/');
    }

    var serviceCatalogRegex = localizedRegexHelper.getRegex(session, [session.gettext(this.menuOptions.serviceCatalog)]);
    if (serviceCatalogRegex.test(message)) {
        // View service Catalog
        return session.beginDialog('service-catalog:/');
    }
};

// Export createLibrary() function
module.exports.menuOptions = {
    checkIn: 'main_options_check_in',
    support: 'main_options_talk_to_support',
    serviceCatalog: "main_options_service_catalog",
    settings: "main_options_settings",
    help: "main_options_talk_to_support"
};