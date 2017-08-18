'use strict';

var bot = require('../../service/bot.service').bot;
var dialog = require('./boardingPassScan.dialog');

bot.dialog(index.login, dialog.login);


module.exports = router;
