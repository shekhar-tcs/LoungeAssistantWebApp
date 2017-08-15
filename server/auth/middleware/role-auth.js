'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var compose = require('composable-middleware');
var tokenAuth = require('./token-auth.js');
var responseBuilder = require('../../components/responseBuilder/responseBuilder');

/**
 * Authentication Middleware
 *
 * Checks if the user has a token and if so checks that they have the required role and user for the route
 */
module.exports = function hasRole(roleRequired, usersRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(tokenAuth)
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                res.json(403, responseBuilder.errorResponse("Error", 'forbiddenAccess', req.preferredLanguage));
            }
        })
        .use(function (req, res, next) {
            if(usersRequired){
                var userRequiredMatched = '';
                for (var index in usersRequired) {
                    var userRequired = usersRequired[index];
                    if (userRequired == req.user._kind) {
                        userRequiredMatched = req.user._kind;
                    }
                }

                if (userRequiredMatched) {
                    next();
                }
                else {
                    res.json(403, responseBuilder.errorResponse("Error", 'forbiddenAccess', req.preferredLanguage));
                }
            } else {
                next();
            }

        });
};
