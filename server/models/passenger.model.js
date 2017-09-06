'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PassengerSchema = new Schema({
    name: { type: String },
    membershipType: { type: String, enum: ['Kris Flyer Gold', 'Kris Flyer Silver'], default: 'Kris Flyer Silver' },
    booking: String
});

module.exports = mongoose.model('Passenger', PassengerSchema);

