/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');

var listeningSocket;
var clientSocket;


module.exports.configure = function (socketio) {

    listeningSocket = socketio;

    socketio.on('connection', function (client) {
        console.log('AGENT %s CONNECTED', client.id);
        clientSocket = client;
    });
}

module.exports.refreshNotifications = function () {
    listeningSocket.emit("refreshNotification");
}