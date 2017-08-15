var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config/environment/index');
var when = require('when');
//var logger = require('../utils/logger.js');

var userService = require('./user.service.js');
var userModel = require('../models/users/user.model.js');

function createToken(user) {
    if (user) {
        // found the user, give them a token
        var expires = moment().add(config.token.amount, config.token.unitOfTime).valueOf();
        var token = jwt.encode(
            {
                iss: user._id,
                exp: expires
            },
            config.secrets.jwtTokenSecret
        );
        return {
            token: token,
            expires: expires,
            // make only send enough to identify the user (don't want to send password, etc)
            user: {
                _id: user._id,
                email:user.email,
                kind:user._kind
            }
        };
    }
}

/**
 * Validates the username and password and calls back with the authenticated
 * user or an error if the user cannot be authenticated.  Expects password
 * in plain text.
 *
 * @param username username/email
 * @param password non hashed password
 * @param isAdmin
 *
 * @returns {*}
 */
function findAuthedUser(username, password, isAdmin) {
    if (!username || !password) {
        // missing username or password
        return when.reject('Missing username or password');
    }

    // Fetch the appropriate user, if they exist

    var defer = when.defer();

    userService.findUserByEmail(username)
        .then(function(user){
            if (!user) {
                // user not found
               return defer.reject('userNotFound');
            }

            var authentication = user.authenticate(password);
            switch (authentication) {
                case userModel.authenticationEnum.success:
                    if(isAdmin ^ (user._kind != 'ConsoleUser')){
                        defer.resolve(user);
                    }else{
                        defer.reject("invalidPassword");
                    }
                    break;
                case userModel.authenticationEnum.invalidPassword:
                    defer.reject('invalidPassword');
                    break;
                case userModel.authenticationEnum.inactive:
                    defer.reject('inactiveUser');
                    break;
                default:
                    defer.reject('invalidPassword');
                    break;
            }

        }, function(err){
            defer.reject('authenticationFailed');
            console.log(err);
        });

    return defer.promise;
}

exports.findAuthedUser = findAuthedUser;
exports.createToken = createToken;
