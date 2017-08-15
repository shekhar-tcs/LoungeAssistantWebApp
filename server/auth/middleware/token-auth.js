'use strict';
/**
 * token-auth.js
 *
 *
 * Authentication Middleware:
 *  Parses the JWT token attached to the request. If valid the user
 *  will be attached to the request.
 *
 *  Uses jwt-simple tokens.
 */

var url = require('url');
var User = require('../../models/users/user.model.js');
var jwt = require('jwt-simple');
var config = require('../../config/environment');
var responseBuilder = require('../../components/responseBuilder/responseBuilder');

module.exports = function (req, res, next) {

    // Parse the URL in case we need it
    var parsed_url = url.parse(req.url, true);

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    var token = (req.body && req.body.access_token) ||
        parsed_url.query.access_token || req.headers["x-access-token"];

    if (!token) {
        // failed auth
        return res.json(401, responseBuilder.errorResponse("Error", 'notAuthorized'));
    }

    try {
        var decoded = jwt.decode(token, config.secrets.jwtTokenSecret);

        if (decoded.exp <= Date.now()) {
            return res.json(401, responseBuilder.errorResponse("Error", 'tokenExpiry'));
        }

        User.findOne({ '_id': decoded.iss }, '-__v -provider -salt -hashedPassword', function (err, user) {

            if (!err && user) {
                // found the user, add it to the request
                req.user = user;
                // happy path!
                return next();
            }

            //return res.send('Not authorized', 401);
            return res.json(401, responseBuilder.errorResponse("Error", 'notAuthorized'));
        })

    } catch (err) {
        // failed auth
        return res.json(401, responseBuilder.errorResponse("Error", 'notAuthorized'));
    }
}