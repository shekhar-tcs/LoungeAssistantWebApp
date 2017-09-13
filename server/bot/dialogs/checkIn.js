var util = require('util');
var builder = require('botbuilder');
var when = require('when');

var lib = new builder.Library('checkIn');
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
            postCheckInWelcomeMessagePromise(session, args.booking.passenger)
                .then(function () {
                    return postServiceMessagePromise(session);
                })
                .then( function () {
                    return postServiceOptionsPromptPromise(session);
                }, function (err) {
                    session.endDialog();
                });
        } else {
            session.endDialog();
        }

    }
]).triggerAction({
    matches: 'Dialog.LoungeCheckIn'
});

var postCheckInWelcomeMessagePromise = function (session, passenger) {
    var defer = when.defer();
    var salutation = passenger.gender === "Male" ? "salutation_male" : "salutation_female";
    setTimeout(function () {
        session.send("welcome_user_after_checkin",
            session.gettext(salutation),
            passenger.name,
            passenger.membershipType);
        defer.resolve();
    }, 0);
    return defer.promise;
}

var postServiceMessagePromise = function (session) {
    var defer = when.defer();
    setTimeout(function () {
        session.send("greet_user_after_checkin_cont");
        defer.resolve();
    }, 1000);
    return defer.promise;
}

var postServiceOptionsPromptPromise = function (session) {
    var defer = when.defer();
    setTimeout(function () {
        //session.send("prompt_choices");
        session.beginDialog("service-catalog:/")
        defer.resolve();
    }, 3000);
    return defer.promise;
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};