'use strict';

var botService = require('../../service/bot.service');
var config = require('../../config/environment');

/**
 * Listen to BotFramework WebHook
 * POST /
 *
 * @param req
 * @param res
 */
exports.listen = function () {
    return botService.connector.listen();
};
