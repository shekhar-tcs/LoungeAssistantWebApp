'use strict';

var deviceService = require('../../service/device.service.js');
var responseBuilder = require('./../../components/responseBuilder/responseBuilder.js');

/**
 * Static Method to handle Server Error
 */
function handleError(res, err) {
    return res.json(500, responseBuilder.errorResponse("Error", err));
}

/**
 * Static Method to Item not found
 */
function handleItemNotFoundError(res, err) {
    return res.json(404, responseBuilder.errorResponse("Error", err));
}

/**
 * Get list of devices
 * GET /devices
 *
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    deviceService.findDevices()
        .then(function (devices) {
            return res.json(200, responseBuilder.successResponse(devices, 'List of devices'));
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Get a single device
 * GET /devices/:id
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
    deviceService.findDeviceById(req.params.id)
        .then(function (device) {
            return res.json(200, responseBuilder.successResponse(device, 'Device Details'));
        }, function (err) {
            if (err == 'itemNotFound') {
                return handleItemNotFoundError(res, err, req.preferredLanguage);
            }
            return handleError(res, err, req.preferredLanguage);
        });
};

/**
 * Get a single device by name
 * GET /devices/name/:id
 *
 * @param req
 * @param res
 */
exports.showByName = function (req, res) {
    var name = req.params.id;
    if (name) {
        deviceService.findDeviceByName(req.params.id)
            .then(function (device) {
                return res.json(200, responseBuilder.successResponse(device, 'Device Details'));
            }, function (err) {
                if (err == 'itemNotFound') {
                    return handleItemNotFoundError(res, err);
                }
                return handleError(res, err);
            });
    } else {
        return handleError(res, 'errorInInputParameters', req.preferredLanguage);
    }

};

/**
 * Creates a new device in the DB.
 * POST /devices
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    deviceService.createDevice(req.body)
        .then(function (device) {
            return res.json(200, responseBuilder.successResponse(device, 'Device Details'));
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Updates an existing device in the DB.
 * PUT /devices/:id
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var device = req.body;
    deviceService.updateDevice(device)
        .then(function (device) {
            return res.json(200, responseBuilder.successResponse(device, 'Device Details'));
        }, function (err) {
            if (err == 'itemNotFound') {
                return handleItemNotFoundError(res, err);
            }
            return handleError(res, err);
        });
};


/**
 * Deletes a device from the DB.
 * DELETE /devices/:id
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
    var deviceId = req.params.id;
    deviceService.deleteDevice(deviceId)
        .then(function () {
            return res.json(204, responseBuilder.successResponse(deviceId, 'Device deleted'));
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Deletes a device by name.
 * DELETE /devices/name/:id
 *
 * @param req
 * @param res
 */
exports.deleteByName = function (req, res) {
    var deviceName = req.params.id;
    deviceService.deleteDevice(deviceName)
        .then(function () {
            return res.json(204, responseBuilder.successResponse(deviceId, 'Device deleted'));
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Get location of the Tag Device
 * GET /location
 * @param req
 * id: DeviceID
 * @param res
 */
exports.readLocation = function (req, res) {
    var deviceId = req.params.id;
    if (deviceId) {
        deviceService.readLocation(deviceId)
            .then(function (location) {
                return res.json(200, responseBuilder.successResponse(location, 'Location of ' + deviceId));
            }, function (err) {
                return handleError(res, err);
            });
    } else return handleError(res, 'errorInInputParameters');
};

/**
 * Write location of the San-Bot
 * POST /location
 * @param req
 * @param res
 */
exports.writeLocationReference = function (req, res) {
    var deviceId = req.body.uid;
    var result = req.body.result;

    if (deviceId && result) {
        var count = 0;
        for (var obj in result) {
            count++;
        }
        if(count == 2) {
            deviceService.writeLocationReference(deviceId, result)
                .then(function (location) {
                    return res.json(200, responseBuilder.successResponse(location, 'Location of ' + deviceId + ' is updated'));
                }, function (err) {
                    if (err == 'itemNotFound') {
                        return handleItemNotFoundError(res, err, req.preferredLanguage);
                    }
                    return handleError(res, err, req.preferredLanguage);
                });
        } else return handleError(res, 'errorInInputParameters');

    } else return handleError(res, 'errorInInputParameters');
};



