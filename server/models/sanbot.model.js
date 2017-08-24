'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var DeviceSchema = require('./device.model').schema;

var SanBotSchema = new Schema({
    name: { type: String },
    positioningDevice: DeviceSchema,
    status: { type: String, enum: ['Idling', 'Calibrating', 'Moving'], default: 'Idling' },
});

exports.model = mongoose.model('SanBot', SanBotSchema);
exports.schema = SanBotSchema;
