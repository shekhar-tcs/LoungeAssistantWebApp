'use strict';

var express = require('express');
var controller = require('./sanbot.controller');
var cors = require('../../auth/middleware/cors.js');

var router = express.Router();

router.use(cors);

// route middleware that will happen on every request
//router.use(tokenAuth);

router.get('/', controller.index);
router.get('/name/:id', controller.showByName);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/name/:id', controller.deleteByName);
router.delete('/:id', controller.destroy);

module.exports = router;
