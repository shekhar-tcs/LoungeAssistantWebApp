'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var tokenAuth = require('../../auth/middleware/token-auth.js'); // checks token only
var roleAuth = require('../../auth/middleware/role-auth.js'); // checks token & role
var preferredLanguage = require('../../localization/middleware/preferred-language'); // checks preferred language

var router = express.Router();

router.get('/', preferredLanguage, controller.index);
router.delete('/:id', preferredLanguage, roleAuth('admin'), controller.destroy);
router.get('/me', preferredLanguage, controller.me);
router.put('/:id/password', preferredLanguage, controller.changePassword);
router.get('/:id', preferredLanguage, controller.show);
router.put('/:id', preferredLanguage, controller.update);

// [Shekhar Sasikumar:9/29/14] TODO: can't have auth from front end because of how 'register' front end form works, but we might still want it from server side?
router.post('/', preferredLanguage, controller.create);

module.exports = router;
