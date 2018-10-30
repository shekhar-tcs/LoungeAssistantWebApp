'use strict';

var SensorReading = require('./../models/sensorReading.model').model;
var when = require('when');

exports.findAllSensorReadingsPromise = function () {
    return SensorReading.find().exec();
}

exports.createSensorReadingPromise = function (sensorReading) {
    var defer = when.defer();

    SensorReading.create(sensorReading)
        .then(function (saved) {
            defer.resolve(saved);
        }, function (err) {
            // wrap up the failed data with the error
            defer.reject({error: err, data: sensorReading});
        });
    return defer.promise;
};

exports.fetchLastRegisteredReadingPromise = function () {
    return SensorReading.findOne().sort({created_at: -1}).exec();
};

exports.deleteAllSensorReadings = function() {
   return SensorReading.find({}).remove().exec();
}