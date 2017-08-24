'use strict';

var Device = require('./../models/device.model.js').model;
var mongoose = require('mongoose');
var _ = require('lodash');
var when = require('when');

exports.findDevicesPromise = function () {
    return Device.find().exec();
}

exports.findDeviceByIdPromise = function (id) {
    return Device.findById(id).exec();
}

exports.findDeviceByNamePromise = function(deviceName){
    return Device.findOne({ name: deviceName }).exec();
}

exports.checkIfDevicesExistsPromise = function(devices){
    var defer = when.defer();
    var deviceQueryArray = [];
    for (var key in devices) {
        var device = devices[key];
        var item = {
            "name": device
        }
        deviceQueryArray.push(item);
    }
    Device.find(
        {
            'name': {
                $in: devices
            }
    },function(err, result) {
       if (!err && result) {
           if(result.length != devices.length) {
               return defer.reject("Need 2 anchors and a tag to record a reading");
           } else {
               return defer.resolve(result);
           }
       }
       defer.reject(err);
    })
    return defer.promise;
}

exports.createDevicePromise = function (device) {
    return Device.create(device); // returns a promise without needing .exec()
};

exports.updateDevicePromise = function (device) {
    var promise = new mongoose.Promise;
    var deviceId;
    if (device._id) {
        deviceId = device._id;
        delete device._id;
    }
    Device.findById(deviceId).exec()
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

exports.deleteDeviceByIdPromise = function (id) {
    return Device.findById(id).remove().exec();
}

exports.deleteDeviceByNamePromise = function (deviceName) {
    Device.find({ name: deviceName }).remove().exec();
}

exports.deleteAllDevicesPromise = function() {
    return Device.find({}).remove().exec();
}
