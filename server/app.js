/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
//replace mongoose default promise with q
mongoose.Promise = require('when').Promise;

// Setup server
var app = express();

var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);
var bot = require('./bot');
app.post('/api/messages', bot.listen());

try {
// Start server
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
} catch (e) {
    console.log('Error starting up server: ' + e);
}

var socketIO = require('socket.io');
var io = socketIO(server);
require('./config/socketio').configure(io);

process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1)
});


// Expose app
exports = module.exports = app;
