'use strict';

var config = require('../../config/environment');
var tokenService = require('../../service/token.service.js');
var userService = require('../../service/user.service.js');
var _str = require('underscore.string');
var responseBuilder = require('./../../components/responseBuilder/responseBuilder.js');

var validationError = function (res, err) {
    return res.json(422, err);
};

/**
 * this controller is spared from the 'responseBuilder' service as the errors are conveyed through mongoose errors to the frontend client

/**
 * Get list of users
 * restriction: 'admin'
 *
 * GET /api/users
 */
exports.index = function (req, res) {
    userService.findUsers()
        .then(function (users) {
            res.json(200, users);
        }, function (err) {
            return res.send(500, err);
        });
};

/**
 * Creates a new user
 * POST /api/users
 */
exports.create = function (req, res) {
    var newUser = req.body;
    userService.createUser(newUser)
        .then(function (user) {
            var token = tokenService.createToken(user);
            var response = responseBuilder.successResponse(token, "Thank you for registering. Please wait for the admin to activate your account to login.");
            res.json(response);
        }, function (err) {
            if ( err == 'userDuplicateKey') {
                return res.json(500, responseBuilder.errorResponse("Error", err, req.preferredLanguage));
            }
            return validationError(res, err);
        });
};

/**
 * Get a single user
 *
 * GET /api/users/:id
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    userService.findUserByIdWithPassword(userId)
        .then(function (user) {
            if (!user) return res.send(401);
            res.json(user.profile);
        }, function (err) {
            return next(err);
        });
};

exports.update = function (req, res) {
    var user = req.body;
    user._id = req.params.id;
    userService.updateUser(user)
        .then(function (userUpdated) {
            return res.json(user);
        })
        .catch(function (err) {
            return res.json(400, responseBuilder.errorResponse(err, "error", req.preferredLanguage));
        })
};

/**
 * Deletes a user
 * restriction: 'admin'
 *
 * DELETE /api/users/:id
 */
exports.destroy = function (req, res) {
    var userId = req.params.id;
    userService.deleteUserById(userId)
        .then(function () {
            return res.send(204);
        }, function (err) {
            return res.send(500, err);
        });
};

/**
 * Change a users password
 *
 * PUT /api/users/:id/password
 */
exports.changePassword = function (req, res) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    userService.changePassword(userId, oldPass, newPass)
        .then(function (user) {
            res.send(200);
        }, function (err) {
            if (_str(err).startsWith('403')) {
                return res.send(403);
            }
            return validationError(res, err);
        });
};


/**
 * Get my info
 *
 * GET /api/users/me
 */
exports.me = function (req, res, next) {
    var user = req.user;
    if (!user) {
        return res.send(401);
    }

    var userId = user._id;

    userService.findUserByIdWithoutPassword(userId)
        .then(function (user) {
            if (!user) {
                return res.json(401);
            }
            res.json(user);
        }, function (err) {
            return next(err);
        });
}


/**
 * Authentication callback
 */
exports.authCallback = function (req, res) {
    res.redirect('/');
};
