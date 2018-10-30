'use strict';

var express = require('express');
var controller = require('./device.controller');
var cors = require('../../auth/middleware/cors.js');

var router = express.Router();

router.use(cors);

// route middleware that will happen on every request
//router.use(tokenAuth);


router.get('/', controller.index);
router.get('/show-alert', controller.showAlert);
router.get('/location/:id', controller.readLocation);
router.get('/by-name/:id', controller.showByName);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/location-reference', controller.writeLocationReference);
router.put('/:id', controller.update);
router.delete('/by-name/:id', controller.deleteByName);
router.delete('/:id', controller.destroy);

module.exports = router;
