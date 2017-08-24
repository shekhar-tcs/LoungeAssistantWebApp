/**
 * Main application routes
 */

'use strict';

var express = require('express')
var errors = require('./components/errors');
var config = require('./config/environment');

module.exports = function (app) {

    // Insert routes below

    app.use(config.botFrameworkWebHook, require('./api/bot'));
    app.use('/api/devices', require('./api/device'));
    app.use('/api/sanbots', require('./api/sanbot'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
