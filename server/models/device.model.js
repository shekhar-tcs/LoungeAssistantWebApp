'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    name: { type: String },
    x: { type: Number , default: 0 },
    y: { type: Number , default: 0 },
    distanceOffset: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ['Anchor-Origin', 'Anchor', 'Anchor-Fixed', 'Tag']
    }
});

exports.model = mongoose.model('Device', DeviceSchema);
exports.schema = DeviceSchema;
