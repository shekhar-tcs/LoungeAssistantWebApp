'use strict';

var express = require('express');
var controller = require('./token.controller.js');
var options = require('../../auth/middleware/options.js');
var cors = require('../../auth/middleware/cors.js');
var preferredLanguage = require('../../localization/middleware/preferred-language'); // checks preferred language

var router = express.Router();

router.use(cors);

router.post('/', preferredLanguage, controller.index); // no auth, this is how a user requests a login token
router.options('/', preferredLanguage, options);


module.exports = router;