'use strict';

var express = require('express');
var controller = require('./bot.controller.js');

var router = express.Router();

router.post('/', controller.listen);
router.get('/', controller.testWebserviceManager);

module.exports = router;
