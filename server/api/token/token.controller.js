var tokenService = require('./../../service/token.service.js');
var responseBuilder = require('./../../components/responseBuilder/responseBuilder.js');
/**
 * Get a token for the user with credentials
 * GET /api/tokens
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var isAdmin = req.body.isAdmin;

    tokenService.findAuthedUser(username, password, isAdmin)
        .then(function (authenticatedUser) {
            if (authenticatedUser) {
                // create token and send back
                var token = tokenService.createToken(authenticatedUser);
                var response = responseBuilder.successResponse(token, "Login success");
                res.json(200, response);
            } else {
                sendErrorResponse(err);
            }
        }, function(err) {
            sendErrorResponse(err);
        });

    var sendErrorResponse = function(err) {
        var errResponse = responseBuilder.errorResponse(null, err, req.preferredLanguage)
        return res.json(errResponse, 401);
    }
}
