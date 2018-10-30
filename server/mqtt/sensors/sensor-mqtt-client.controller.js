/**
 * Socket.io configuration
 */

'use strict';

var mqtt = require('mqtt');
var sensorService = require("../../service/sensor.service");

module.exports.configure = function () {
    var client = createMqttClient();

    client.on('connect', function () {
        console.log('Oh Glorious Day! I have connected to HiveMQ broker. ')
        client.subscribe('mosquitto_main_topic');
    });

    client.on('message', function (topic, message) {
        console.log(topic);
        console.log(message.toString());
        var jsonString = message.toString();
        var messageJson = JSON.parse(jsonString);
        sensorService.captureNewSensorReading(messageJson);
    });
}

function createMqttClient() {
    return mqtt.connect('tcp://ec2-13-250-73-145.ap-southeast-1.compute.amazonaws.com:1883');
}
