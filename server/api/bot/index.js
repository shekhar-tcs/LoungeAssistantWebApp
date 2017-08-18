'use strict';

var express = require('express');
var controller = require('./bot.controller.js');

var router = express.Router();

router.post('/', controller.listen());


module.exports = router;
