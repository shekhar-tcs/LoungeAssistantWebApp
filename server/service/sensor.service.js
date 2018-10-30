/**
 * Service layer for carts
 */
'use strict';

var when = require('when');
var sensorReadingDao = require("./../dao/sensorReading.dao")
var anomalyDao = require("./../dao/anomaly.dao")
var emailService = require("./email-client.service");

var anomalyDetected = false;
/**
 * Service Methods
 */

var isTheDateDifferenceIsBeyondLimit = function(newReadingTimestamp, lastAnomalyTimestamp) {
    if ((newReadingTimestamp - lastAnomalyTimestamp) > 0) {
        var timeDifferenceInSeconds = Math.abs(parseInt(newReadingTimestamp - lastAnomalyTimestamp) / (1000));
        if (timeDifferenceInSeconds > 180) {
            return true;
        } else {
            return false;
        }
    }
}

var checkIfReadingIsEligibleToBeRegistered = function(registeredSensorReading) {
    var defer = when.defer();
    fetchLastRegisteredAnomaly()
        .then(function(lastAnomalyReading) {
            var isBeyondLimit = isTheDateDifferenceIsBeyondLimit(registeredSensorReading.timestamp, lastAnomalyReading === null ? 0 : lastAnomalyReading.timestamp);
            if (isBeyondLimit) {
                return defer.resolve(true);
            } else {
                return defer.reject("Not beyond time limit yet");
            }
        }, function(err) {
            return defer.reject(err);
        })
    return defer.promise;
}

var fetchLastRegisteredAnomaly = function() {
    return anomalyDao.fetchLastRegisteredReadingPromise();
}

var checkIfTheReadingIsAnomalous = function(reading) {
    //check if the new reading is greater than or less average reading
    var defer = when.defer();
    fetchAverageOfReadings()
        .then(function(averageReading) {
            var readingHumidity = parseFloat(reading.humidity);
            var readingTemperature = parseFloat(reading.temperatureInCelsius);
            var anomalousTemperature = false;
            var anomalousHumidity = false;

            if (Math.abs(readingHumidity - averageReading.humidity) > 2) {
                console.log("Average Humidity is " + " " + averageReading.humidity);
                console.log("Current humidity is " + " " + readingHumidity);
                anomalousHumidity = true;
            }

            if (Math.abs(readingTemperature - averageReading.temperature) > 2) {
                console.log("Average Temperature is " + " " + averageReading.temperature);
                console.log("Current temperature is " + " " + readingTemperature);
                anomalousTemperature = true;
            }

            var anomalyDetection = {
                anomalousHumidity: anomalousHumidity,
                anomalousTemperature:anomalousTemperature
            }

            if (anomalousHumidity === true || anomalousTemperature === true) {
                return defer.resolve(true)
            } else {
                defer.reject("Not anomalous");
            }
        })
    return defer.promise;
}

var fetchAverageOfReadings = function() {
    var defer = when.defer();
    sensorReadingDao.findAllSensorReadingsPromise()
        .then(function (registeredReadings) {
            var count = 0;
            var totalTemperatureInCelsius = 0.0;
            var totalHumidity = 0.0;
            for (var key in registeredReadings) {
                var reading = registeredReadings[key];
                totalTemperatureInCelsius+= parseFloat(reading.temperatureInCelsius);
                totalHumidity+= parseFloat(reading.humidity);
                count++;
            }
            var averageTemperature = totalTemperatureInCelsius / count;
            var averageHumidity = totalHumidity / count;
            var averageReading = {
                temperature: averageTemperature,
                humidity: averageHumidity
            }
            return defer.resolve(averageReading);
        }, function (err) {
            return defer.reject(err);
        })
    return defer.promise;
}

var registerAnomaly = function(anomaly) {
    anomalyDetected = false;
    return anomalyDao.createAnomalyPromise(anomaly);
}

var sendAnomalyNotification = function() {
    emailService.sendEmail();
}


exports.captureNewSensorReading = function (sensorMQTTMessage) {
    var defer = when.defer();

    var sensorReading = {
        clientName: sensorMQTTMessage.client,
        temperatureInCelsius: sensorMQTTMessage.celcius,
        temperatureInFahrenheit: sensorMQTTMessage.fahrenheit,
        humidity: sensorMQTTMessage.humidity,
        heatIndexCelsius: sensorMQTTMessage.heatIndexCelsius,
        heatIndexFahrenheit: sensorMQTTMessage.heatIndexFahrenheit
    }
    sensorReadingDao.createSensorReadingPromise(sensorReading)
        .then(function(registeredSensorReading) {
            if (registeredSensorReading) {
                checkIfTheReadingIsAnomalous(registeredSensorReading)
                    .then(function(isAnomalous) {
                        if (isAnomalous === true) {
                            return checkIfReadingIsEligibleToBeRegistered(registeredSensorReading)
                        }
                    })
                    .then(function (eligibleToBeRegistered) {
                        if (eligibleToBeRegistered === true) {
                            var anomaly = {
                                timestamp: Date.now(),
                                reading: registeredSensorReading
                            }
                            console.log("Anomaly detected" + anomaly);
                            registerAnomaly(anomaly);
                            sendAnomalyNotification();
                        }
                    },
                        function (err) {
                        // wrap up the failed data with the error
                        return defer.reject(err);
                    });
            }
        },
            function (err) {
            // wrap up the failed data with the error
            return defer.reject({error: err, data: sensorReading});
        });
    return defer.promise;
}




