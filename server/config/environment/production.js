'use strict';

// Production specific configuration
// =================================
module.exports = {
    mongo: {
        uri: 'mongodb://admin:password@ds145780.mlab.com:45780/trackmytools-prod'
    },
    bot:{
        appId: "3c230dca-076d-46e8-8357-f12127fc467f",
        appPassword: "5j2HE9XzyoJr0hoqmq7mKAR"
    },
    luisEndpoint: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ae067585-3993-4641-ba0c-8d0a62959bc7?subscription-key=3e7af6f57fff4a409e242414178db93e&staging=true&verbose=true&timezoneOffset=0"
};
