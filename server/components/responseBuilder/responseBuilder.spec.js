/*
  Mocha testing with should.js
 */
'use strict';

var should = require('should');
var when = require('when');

var builder = require('./responseBuilder.js');

describe('responseBuilder methods', function () {

  it('should return default success response', function () {

    var data = {'text':'hello'};
    var res = builder.successResponse(data);
    should(res).have.property('response').eql({
      message: 'successful',
      status: 'S',
      code: '#200_success'
    });
    should(res).have.property('data').eql(data)
  });

  it('should return custom success response',function () {
    var data = {'text':'hello'};
    var message = "This is a test";
    var res = builder.successResponse(data, message);
    should(res).have.property('response').eql({
      message: message,
      status: 'S',
      code: '#200_success'
    });
    should(res).have.property('data').eql(data)
  });

  it('should return default error response',function () {
    var data = {'text':'hello'};
    var res = builder.errorResponse(data);
    should(res).have.property('response').eql({
      message: 'error! error not specified',
      status: 'F',
      code: "#400_ENS"
    });
    should(res).have.property('data').eql(data)
  });

  it('should return default error response if error key is not in error.default.json file',function () {
    var data = {'text':'hello'};
    var res = builder.errorResponse(data, "not_in_the_list");
    should(res).have.property('response').eql({
      message: 'error! error not specified',
      status: 'F',
      code: "#400_ENS"
    });
    should(res).have.property('data').eql(data)
  });

  it('should return error response in the error.default.json file',function () {
    var data = {'text':'hello'};
    var res = builder.errorResponse(data, "username_password_not_match");
    should(res).have.property('response').eql({
      message: "username and password did not match",
      status: "F",
      code: "#401_UPNM"
    });
    should(res).have.property('data').eql(data)
  });
});

