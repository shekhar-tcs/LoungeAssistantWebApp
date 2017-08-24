/**
 * Service for Sanbot Tracker
 */
'use strict';

var when = require('when');

var deviceDao = require("./../dao/device.dao");
var locationReadingDao = require("./../dao/locationReading.dao")

/**
 * Service Methods
 */

exports.readLocation = function () {
    return distance;
}

var validateDevicesBeforeWriting = function(deviceId, result) {
    var deviceArray = [deviceId];
    for (var device in result) {
        deviceArray.push(device);
    }

    return deviceDao.checkIfDevicesExistsPromise(deviceArray);
}

// exports.writeLocation = function (deviceId, result) {
//     var defer = when.defer();
//
//     validateDevicesBeforeWriting(deviceId, result)
//         .then(function (devices) {
//             var tagDevice;
//             for (var key in devices) {
//                 var device = devices[key];
//                 if (device.name == deviceId) {
//                     tagDevice = device;
//                     devices.remove(device);
//                 }
//                 break;
//             }
//
//             var deviceOne = devices[0];
//             var deviceTwo = devices[1];
//             var distanceDeviceOne = result[deviceOne] - deviceOne.distanceOffset;
//             var distanceDeviceTwo = result[deviceTwo] - deviceTwo.distanceOffset;
//             var locationReading = {
//                 deviceName: tagDevice.name,
//                 referenceOne: {
//                     device: deviceOne,
//                     distance: distanceDeviceOne
//                 },
//                 referenceTwo: {
//                     device: deviceTwo,
//                     distance: distanceDeviceTwo
//                 },
//             }
//             // if(!error.pert) {
//             //     distance["EC03"]["EC01"] = distance["EC03"]["EC01"] - error["EC01"];
//             //     distance["EC03"]["EC02"] = distance["EC03"]["EC02"] - error["EC02"];
//             // }
//             // else {
//             //     distance["EC03"]["EC01"] = distance["EC03"]["EC01"] / (1+(error["EC01"]/100));
//             //     distance["EC03"]["EC02"] = distance["EC03"]["EC02"] / (1+(error["EC02"]/100));
//             //
//             //     distance["EC03"]["EC01"] = Math.round(distance["EC03"]["EC01"]*100)/100;
//             //     distance["EC03"]["EC02"] = Math.round(distance["EC03"]["EC02"]*100)/100;
//             // }
//
//             locationReadingDao.createLocationReadingPromise(locationReading)
//                 .then(function (savedReading) {
//                     defer.resolve(savedReading);
//                 }, function (err) {
//                     defer.reject(err)
//                 })
//         }, function (err) {
//             defer.reject("The devices do not exist")
//         });
//
//     return defer.promise;
// }




