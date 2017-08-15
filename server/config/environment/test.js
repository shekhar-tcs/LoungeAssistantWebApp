'use strict';

// Test specific configuration
// ===========================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://themrolab:password@ds143900.mlab.com:43900/nonpool-aog-dev'
    },
    azureBlob: {
        connectionString: "DefaultEndpointsProtocol=https;AccountName=nonpoolaog;AccountKey=kxO/bHsC9WtQZbCxkuhXmy+r+udMCGSlDLHOeSLLEj/3h8RKo5aO0/9qc7Pm9tCfIXplaBSqM0RJWfqHTBcULg==;EndpointSuffix=core.windows.net",
        apiKey: "kxO/bHsC9WtQZbCxkuhXmy+r+udMCGSlDLHOeSLLEj/3h8RKo5aO0/9qc7Pm9tCfIXplaBSqM0RJWfqHTBcULg==",
        host: "https://nonpoolaog.blob.core.windows.net/",
        containerName: "nonpoolaog",
        storageAccountName: "nonpoolaog"
    },
    seedDB: false,
    site:{
        domain: 'alpha-nonpoolaog.herokuapp.com',
        https: true
    }
};
