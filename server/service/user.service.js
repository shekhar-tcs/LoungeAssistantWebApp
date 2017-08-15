'use strict';

var when = require('when');
var config = require('../config/environment');

var userDao = require('../dao/user.dao.js');

function findUsers() {
    return when(userDao.findUsersPromise());
}

function findUserByEmail(email) {
    return when(userDao.findUserByEmailPromise(email));
}

/**
 * WARNING: returns password info!
 *
 * @param id
 * @returns {*}
 */
function findUserByIdWithPassword(id) {
    return when(userDao.findUserByIdPromise(id));
}

function findUserByIdWithoutPassword(id) {
    return when(userDao.findUserByIdWithoutPasswordPromise(id));
}

function createUser(user) {
    return when(userDao.createPromise(user));
}

function createUsers(users) {
    return when(userDao.createUsersPromise(users));
}

function updateUser(user){
    return when(userDao.updatePromise(user));
}
/**
 * Deletes a user
 */
function deleteUserById(id) {
    return when(userDao.deleteUserByIdPromise(id));
}

function deleteAllUsers() {
    return when(userDao.deleteAllUsers());
}

function changePassword(userId, oldPass, newPass) {
    var defer = when.defer();
    findUserByIdWithPassword(userId)
        .then(function (user) {
            if (user.authenticate(oldPass)) {
                user.password = newPass;
                user.save(function (err, user) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(user);
                    }
                });
            }
        }, function (err) {
            defer.reject('403 ' + err);
        });
    return defer.promise;
}

exports.findUsers = findUsers;
exports.findUserByEmail = findUserByEmail;
exports.findUserByIdWithPassword = findUserByIdWithPassword;
exports.findUserByIdWithoutPassword = findUserByIdWithoutPassword;
exports.createUser = createUser;
exports.createUsers = createUsers;
exports.deleteUserById = deleteUserById;
exports.deleteAllUsers = deleteAllUsers;
exports.changePassword = changePassword;
exports.updateUser = updateUser;
