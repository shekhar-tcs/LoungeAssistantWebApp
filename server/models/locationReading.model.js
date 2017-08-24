'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var DeviceSchema = require('./device.model').schema;

var LocationReadingSchema = new Schema({
    deviceName: String,
    referenceAnchorOrigin: {
        device: DeviceSchema,
        distance: Number
    },
    referenceAnchor: {
        device: DeviceSchema,
        distance: Number
    },
    timestamp: { type: Date, default: Date.now }
});

exports.model = mongoose.model('LocationReading', LocationReadingSchema);
exports.schema = LocationReadingSchema;
