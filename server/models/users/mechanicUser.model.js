/**
 * Created by leon on 28/3/17.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    User = require('./user.model.js');

var MechanicUserSchema = new Schema({
    title: String
}, {
    discriminatorKey: '_kind'
});


module.exports = User.discriminator('MechanicUser', MechanicUserSchema);
