'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SensorReadingSchema = require('./sensorReading.model').schema;

var AnomalySchema = new Schema({
    reading: SensorReadingSchema,
    timestamp: { type: Date, default: Date.now }
});

exports.model = mongoose.model('Anomaly', AnomalySchema);
exports.schema = AnomalySchema;
