'use strict';

var model = require('./../models/users/user.model.js');
var mongoose = require('mongoose');

//[Shekhar Sasikumar:10/8/14] TODO: finish pulling dao related code from user.service


exports.findUsersPromise = function () {
    return model.find({}, '-salt -hashedPassword');
};

exports.findUserByEmailPromise = function(email) {
    return model.findOne({ email: email });
};

exports.findUserByIdPromise = function (id) {
    return model.findById(id);
};

exports.findUserByIdWithoutPasswordPromise = function (id) {
    return model.findOne({ _id: id }, '-salt -hashedPassword');
};

exports.createPromise = function(user) {
    return model.create(user);
};

exports.updatePromise = function (user) {
    return model.findById(user._id).then(function (userFound) {
        if(!userFound){
            return when.reject("user not found");
        }
        return userFound.update(user);
    });
};

exports.deleteUserByIdPromise = function (id) {
    return model.findById(id).remove();
};

exports.deleteAllUsers = function () {
    return model.find({}).remove();
};
