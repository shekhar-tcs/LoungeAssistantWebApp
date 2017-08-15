'use strict';
/**
 * preferred-language.js
 *
 *
 * Localization Middleware:
 *  Parses the Accept-language attached to the request.
 *
 */

var url = require('url');
var config = require('../../config/environment');
var acceptedLanguages = ["en", "fr"];

module.exports = function (req, res, next) {

    /**
     * Take the Language from:
     *
     *  - Accept-Language header
     */
    var preferredLanguage =  req.headers["accept-language"];
    if (!preferredLanguage) {
        req.preferredLanguage = 'en';
    } else {
        var preferredExistsInAcceptedLanguages = (acceptedLanguages.indexOf(preferredLanguage) > -1);
        if (preferredExistsInAcceptedLanguages) {
            req.preferredLanguage = preferredLanguage;
        } else {
            req.preferredLanguage = 'en';
        }
    }

    return next();
}