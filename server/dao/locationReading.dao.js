'use strict';

var LocationReading = require('./../models/locationReading.model').model;
var mongoose = require('mongoose');
var when = require('when');

exports.findAllLocationReadingsPromise = function () {
    return LocationReading.find().exec();
}

exports.findLocationReadingsByDeviceNamePromise = function (deviceId) {
    return LocationReading.findOne({ deviceName: deviceId }).exec();
}

exports.createLocationReadingPromise = function (locationReading) {
    var defer = when.defer();

    LocationReading.create(locationReading)
        .then(function (saved) {
            defer.resolve(saved);
        }, function (err) {
            // wrap up the failed data with the error
            defer.reject({error: err, data: locationReading});
        });
    return defer.promise;
};

exports.deleteLocationReadingsByDeviceNamePromise = function (deviceId) {
   return LocationReading.find({ deviceName: deviceId }).remove().exec();
}

exports.deleteAllLocationReadings = function() {
   return LocationReading.find({}).remove().exec();
}