
var request = require('request');

var when = require('when');

var apiUrlPrefix = '/api';
var appendUrlPrefix = function(url) {
    return apiUrlPrefix + url;
};
var getRequestOptions = function(url, headers, data, method) {
    var request = {
        url: url,
        method: method
    };
    request['headers'] = {
        'Content-Type' : 'application/json'};
    if (method == 'GET') {
        request['qs'] = data;
    } else {
        request['data'] = data;
    }
    return request;
};

var executeRequest = function (method, url, headers, data) {

    var defer = when.defer();
    var requestOptions = getRequestOptions(url, headers, data, method);
    request(requestOptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = JSON.parse(body);
            return defer.resolve(response);
        }
        defer.reject(body);
    })

    return defer.promise;
};

exports.post = function (url, headers, data) {
    return executeRequest("POST", url, headers, data);
};
exports.put = function (url, headers, data) {
    return executeRequest("PUT", url, headers, data);
};
exports.get = function (url, headers, data) {
    return executeRequest("GET", url, headers, data);
};
exports.delete = function (url, headers, data) {
    return executeRequest("DELETE", url, headers, data);
};
exports.patch = function (url, headers, data) {
    return executeRequest("PATCH", url, headers, data);
};


