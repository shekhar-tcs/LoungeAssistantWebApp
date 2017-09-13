var builder = require('botbuilder');
var bookingService = require('../../service/booking.service');
var lib = new builder.Library('scanBoardingPass');
var bot = require('../../bot');
// Register BotBuilder-Location dialog
//lib.library(locationDialog.createLibrary(process.env.BING_MAPS_KEY));

// Main request address dialog, invokes BotBuilder-Location
lib.dialog('/', [
    function (session, args) {
        // Ask for address
        args = args || {};
        var promptMessage = args.promptMessage || 'default_scan_prompt';
        session.dialogData.promptMessage = promptMessage;

        // Prompt to scan the boarding pass qrcode
        builder.Prompts.text(session, promptMessage);
    },
    function (session, results) {
        if (results.response) {
            session.send('please_wait_processing');
            // Return scanned qrcode string to previous dialog in stack
            var qrcodeString = results.response;
            // Retrieve order and create ReceiptCard
            bookingService.retrieveBooking(qrcodeString)
                .then(function (booking) {
                    if (!booking) {
                        throw new Error(session.gettext('booking_not_found'));
                    }

                    session.endDialogWithResult({
                        booking: booking
                    });

            }).catch(function (err) {
                session.send(session.gettext('error_occurred', err.message));
                var title = "rescan_prompt";
                var msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments([
                        new builder.HeroCard(session)
                            .title(title)
                            .buttons([
                                new builder.CardAction.imBack(session, "yes", "yes"),
                                new builder.CardAction.imBack(session, "cancel", "cancel")
                            ])
                    ]);
                builder.Prompts.choice(session, msg, ["yes", "cancel"]);
                //session.replaceDialog('/', { promptMessage: 'booking_not_found' + 'rescan_prompt' });
            });
        } else {
            // No address resolved, restart
            session.replaceDialog('/', { promptMessage: session.dialogData.promptMessage });
        }
    }, function (session, results) {
        if(results.response.entity == "yes") {

            // go to action menu
            session.replaceDialog('/', { promptMessage: session.dialogData.promptMessage });

        } else if(results.response.entity == "cancel"){

            session.endDialog("thanks_end_conversation");
        }  else {
            session.endDialog();
        }
    }]);

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};