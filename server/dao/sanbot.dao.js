'use strict';

var Sanbot = require('./../models/sanbot.model').model;
var mongoose = require('mongoose');
var _ = require('lodash');

exports.findDevicesPromise = function () {
    return Sanbot.find().exec();
}

exports.findSanbotByIdPromise = function (id) {
    return Sanbot.findById(id).exec();
}

exports.findSanbotByNamePromise = function(deviceName){
    return Sanbot.findOne({ name: deviceName }).exec();
}

exports.checkIfSanbotsExistsPromise = function(devices){
    var promise = new mongoose.Promise;
    var deviceQueryArray = [];
    for (var key in devices) {
        var device = devices[key];
        var item = {
            "name": device
        }
        deviceQueryArray.push(item);
    }
    return Sanbot.find({
        "$and": deviceQueryArray
    },function(err, result) {
        if (!err && result) {
            if(result.count != devices.length) {
                return promise.reject("Error device doesn't exist");
            }
            return promise.complete()
        }
        promise.reject(err);
    })
    return promise;
}

exports.createSanbotPromise = function (device) {
    return Sanbot.create(device); // returns a promise without needing .exec()
};

exports.updateSanbotPromise = function (device) {
    var promise = new mongoose.Promise;
    var deviceId;
    if (device._id) {
        deviceId = device._id;
        delete device._id;
    }
    Sanbot.findById(deviceId).exec()
        .then(function(deviceToUpdate) {
            if (!deviceToUpdate) {
                return promise.reject('No device with id=' + deviceId + ' found to update.');
            }
            var updated = _.merge(deviceToUpdate, device);
            updated.save(function (err) {
                if (err) {
                    return promise.reject(err);
                }
                return promise.complete(deviceToUpdate);
            });
        }, function(err){
            return promise.reject(err);
        });

    return promise;
}

exports.deleteSanbotByIdPromise = function (id) {
    return Sanbot.findById(id).remove().exec();
}

exports.deleteAllSanbots = function() {
    return Sanbot.find({}).remove().exec();
}
