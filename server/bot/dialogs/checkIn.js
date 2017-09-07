var util = require('util');
var builder = require('botbuilder');

var lib = new builder.Library('checkIn');
lib.dialog('/', [
    function (session) {
        // Ask to scan the QR code using 'scanBoardingPass' library
        session.beginDialog('scanBoardingPass:/',
            {
                promptMessage: session.gettext('scan_boarding_pass')
            });
    },
    function (session, args) {
        // Retrieve qrcodeString, continue to menu
        //session.userData.qrcodeString = args.qrcodeString;
        session.userData.booking = args.booking;
        session.send()
        session.beginDialog('service-catalog:/');
    },
    function (session, args) {
        // Retrieve selection, continue to delivery date
        session.dialogData.selection = args.selection;
        session.beginDialog('delivery:date');
    },
    function (session, args) {
        // Retrieve deliveryDate, continue to details
        session.dialogData.deliveryDate = args.deliveryDate;
        session.send('confirm_choice', session.dialogData.selection.name, session.dialogData.deliveryDate.toLocaleDateString());
        session.beginDialog('details:/');
    },
    function (session, args) {
        // Retrieve details, continue to billing address
        session.dialogData.details = args.details;
        session.beginDialog('address:billing');
    },
    function (session, args, next) {
        // Retrieve billing address
        session.dialogData.billingAddress = args.billingAddress;
        next();
    },
    function (session, args) {
        // Continue to checkout
        var order = {
            selection: session.dialogData.selection,
            delivery: {
                date: session.dialogData.deliveryDate,
                address: session.dialogData.recipientAddress
            },
            details: session.dialogData.details,
            billingAddress: session.dialogData.billingAddress
        };

        console.log('order', order);
        session.beginDialog('checkout:/', { order: order });
    }
]);

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};