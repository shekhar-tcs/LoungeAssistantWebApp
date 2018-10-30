'use strict';

var Anomaly = require('./../models/anomaly.model').model;
var when = require('when');

exports.findAnomaliesPromise = function () {
    return Anomaly.find().exec();
}

exports.createAnomalyPromise = function (anomaly) {
    return Anomaly.create(anomaly); // returns a promise without needing .exec()
};

exports.fetchLastRegisteredReadingPromise = function () {
    return Anomaly.findOne().sort({timestamp: -1}).exec();
};

exports.deleteAllAnomaliesPromise = function() {
    return Anomaly.find({}).remove().exec();
}
