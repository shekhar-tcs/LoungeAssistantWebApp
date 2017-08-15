

var azure = require('azure-storage');
var config = require('../config/environment');
var blobService = azure.createBlobService();
var when = require('when');

exports.createBlob = function (file, containerFolder) {
    var defer = when.defer();
    if (file.originalFilename) {
        var size = file.size;
        var name = containerFolder + '/' + file.originalFilename;

        blobService.createBlockBlobFromLocalFile(config.azureBlob.containerName, name, file.path, size, function(error, blobData) {
            if (error) {
                defer.reject(err);
            }
            var attachment = {
                name: file.originalFilename,
                url: config.azureBlob.host + config.azureBlob.containerName + '/' + blobData.name
            }
            defer.resolve(attachment)
        });
    } else {
        defer.reject('Please check the file name');
    }
    return defer.promise;
};

exports.deleteBlob = function (fileName, containerFolder) {
    var defer = when.defer();
    if (fileName) {
        var name = containerFolder + '/' + fileName;

        blobService.deleteBlob(config.azureBlob.containerName, name, function(error, response) {
            if (error) {
                defer.reject(error);
            }
            defer.resolve(response);
        });
    } else {
        defer.reject('Please check the file name');
    }
    return defer.promise;
};

