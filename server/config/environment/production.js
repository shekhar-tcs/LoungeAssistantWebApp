'use strict';

// Production specific configuration
// =================================
module.exports = {
    mongo: {
        uri: 'mongodb://user:password@ds153003.mlab.com:53003/sia-loungeassistant'
    },
    bot:{
        appId: "a908e032-0709-413d-88c7-f7e5204bcef2",
        appPassword: "zvn7uC357Mwnfamnhid9q4y"
    },
    luisEndpoint: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6066d9ee-4cf0-49e7-879e-86d7efee96d8?subscription-key=3e7af6f57fff4a409e242414178db93e&verbose=true&timezoneOffset=0"
};
