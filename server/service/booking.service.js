var uuid = require('uuid');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
var path = require('path');

var BookingService = {

    retrieveBooking: function (bookingId) {
        var bookings = this.load();
        var booking = _.find(bookings, ['id', bookingId]);
        return Promise.resolve(booking);
    },


    // persistence
    load: function () {
        console.log(__dirname);
        var json = fs.readFileSync(path.join(__dirname, '../data/bookings.json'), { encoding: 'utf8' });
        return JSON.parse(json);
    },
    save: function (orders) {
        var json = JSON.stringify(orders);
        fs.writeFileSync(path.join(__dirname, '../data/bookings.json'), json, { encoding: 'utf8' });
    }
};

module.exports = BookingService;