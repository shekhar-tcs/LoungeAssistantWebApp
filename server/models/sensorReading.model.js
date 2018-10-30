'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorReadingSchema = new Schema({
    clientName: String,
    temperatureInCelsius: String,
    temperatureInFahrenheit: String,
    humidity: String,
    heatIndexCelsius: String,
    heatIndexFahrenheit: String,
    timestamp: { type: Date, default: Date.now }
});

exports.model = mongoose.model('SensorReading', SensorReadingSchema);
exports.schema = SensorReadingSchema;
