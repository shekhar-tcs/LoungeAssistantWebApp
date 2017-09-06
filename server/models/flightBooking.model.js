'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FlightBookingSchema = new Schema({
    referenceNumber: { type: String },
    origin: { type: String },
    destination: { type: String },
    date: { type: Date }
});

exports.model = mongoose.model('FlightBooking', FlightBookingSchema);
exports.schema = FlightBookingSchema;
