/**
 * Service layer for carts
 */
'use strict';

var when = require('when');
var deviceDao = require('../dao/device.dao');
var locationReadingDao = require("./../dao/locationReading.dao")
var triangulationService = require('../components/functions/triangulation.service');
var deviceReadings = {};
/**
 * Service Methods
 */

exports.findDevices = function () {
    return when(deviceDao.findDevicesPromise());
}

exports.findDeviceById = function (deviceId) {
    var defer = when.defer();
    deviceDao.findDeviceByIdPromise(deviceId)
        .then(function (device) {
            if (device) {
                defer.resolve(device);
            } else defer.reject('itemNotFound');
        }, function (err) {
            defer.reject(err);
        })
    return defer.promise;
}

exports.findDeviceByName = function (name) {
    var defer = when.defer();
    deviceDao.findDeviceByNamePromise(name)
        .then(function (device) {
            if (device) {
                defer.resolve(device);
            } else defer.reject('itemNotFound');
        }, function (err) {
            defer.reject(err);
        })
    return defer.promise;
}

exports.createDevice = function (device) {
    var defer = when.defer();
    deviceDao.createDevicePromise(device)
        .then(function(createdDevice){
            defer.resolve(createdDevice);
        }, function (err) {
            defer.reject(err);
        })
    return defer.promise;
}


exports.updateDevice = function (device) {
    if (!device) {
        return when.reject('Cannot update empty device');
    }
    return when(deviceDao.updateDevicePromise(device));
}


exports.deleteDevice = function (id) {
    return when(deviceDao.deleteDeviceByIdPromise(id));
};

exports.deleteDeviceByName = function (deviceName) {
    return when(deviceDao.deleteDeviceByNamePromise(deviceName));
};

exports.deleteAllDevices = function () {
    return when(deviceDao.deleteAllDevicesPromise());
};

var calculateCoordinatesFromReading = function (locationReading, defer) {
    var anchorDeviceThreeX = 0;
    var anchorDeviceThreeY = -50;
    //var anchorDeviceThreeDistance = 100;
    var coordinates = triangulationService.getCoordinates(
        locationReading.referenceAnchorOrigin.device.x,
        locationReading.referenceAnchorOrigin.device.y,
        locationReading.referenceAnchorOrigin.distance,
        locationReading.referenceAnchor.device.x,
        locationReading.referenceAnchor.device.y,
        locationReading.referenceAnchor.distance,
        anchorDeviceThreeX,
        anchorDeviceThreeY,
        1,
        1);
    if (!coordinates) {
        return defer.err("Some error in populating the coordinates");
    }
    defer.resolve(coordinates);
}

exports.readLocation = function (deviceName) {
    var defer = when.defer();
    if (deviceReadings.hasOwnProperty(deviceName)) {
        setTimeout ( function() {
            var locationReading = deviceReadings[deviceName];
            calculateCoordinatesFromReading(locationReading, defer);
        }, 0);
    } else {
        locationReadingDao.findLocationReadingsByDeviceNamePromise(deviceName)
            .then(function (locationReading) {
                if (locationReading) {
                    calculateCoordinatesFromReading(locationReading, defer);
                } else {
                    defer.reject("No Reading found for " + deviceName);
                }
            }, function (err) {
                defer.reject(err);
            })

    }
    return defer.promise;
}

var validateDevicesBeforeWriting = function(deviceId, result) {
    var deviceArray = [deviceId];
    for (var device in result) {
        deviceArray.push(device);
    }

    return deviceDao.checkIfDevicesExistsPromise(deviceArray);
}


exports.writeLocationReference = function (deviceId, result) {
    var defer = when.defer();

    validateDevicesBeforeWriting(deviceId, result)
        .then(function (devices) {
            var tagDevice;
            var anchorOriginDevice;
            var anchorDevice;
            for (var key in devices) {
                var device = devices[key];
                switch (device.type)
                {
                    case 'Anchor-Origin':
                        anchorOriginDevice = device;
                    break;
                    case 'Anchor':
                        anchorDevice = device;
                        break;
                    case 'Tag':
                        tagDevice = device;
                        break;
                }

            }

            var distanceAnchorOrigin = result[anchorOriginDevice.name] - anchorOriginDevice.distanceOffset;
            var distanceAnchor = result[anchorDevice.name] - anchorDevice.distanceOffset;
            var locationReading = {
                deviceName: tagDevice.name,
                referenceAnchorOrigin: {
                    device: anchorOriginDevice,
                    distance: distanceAnchorOrigin
                },
                referenceAnchor: {
                    device: anchorDevice,
                    distance: distanceAnchor
                }
            }
            deviceReadings[tagDevice.name] = locationReading;
            locationReadingDao.findLocationReadingsByDeviceNamePromise(tagDevice.name)
                .then(function(previousReading) {
                    if (previousReading) {
                        previousReading.referenceAnchorOrigin.distance = locationReading.referenceAnchorOrigin.distance;
                        previousReading.referenceAnchor.distance = locationReading.referenceAnchor.distance;
                        previousReading.save(function (err) {
                            if (err) {
                                return defer.reject(err);
                            }
                            return defer.resolve();
                        });
                    } else {
                        locationReadingDao.createLocationReadingPromise(locationReading)
                            .then(function (savedReading) {
                                defer.resolve(savedReading);
                            }, function (err) {
                                defer.reject(err)
                            })
                    }
                })
        }, function (err) {
            defer.reject("The devices do not exist")
        });

    return defer.promise;
}



