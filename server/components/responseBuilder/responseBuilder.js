'use strict';

/** @constructor */
function Response(msg, code, data) {
  this.status = {
    message: msg,
    code: code
  };
  this.data = data;
}

var buildResponse = {};

/**
 *
 * @param {Object} data - data object
 * @param {string} [message] - success message
 * @returns {Object} response object
 */
buildResponse.successResponse = function (data, message) {
  if(!message){
    //no message, give default
    return new Response("Successful", "200#success", data);
  }else{
    return new Response(message,"200#success", data);
  }
};

/**
 *
 * @param {Object} data - data object
 * @param {string} [error] - exception string in error.default.json
 * @returns {Object} response object
 */
buildResponse.errorResponse = function (data, error) {
  var errors = require('./statusCode-en.json');
  //check whether error is not specified
  if (!error) {
    //get the default error
    return new Response(errors.default.message, errors.default.code, data);
  } else {
    const err = errors[error];
    if (!err) {
      //err_key is not found in error.default.json, return default error
      return new Response(error, errors.default.code, data);
    } else {
      return new Response(err.message, err.code, data);
    }
  }
};

module.exports = buildResponse;
