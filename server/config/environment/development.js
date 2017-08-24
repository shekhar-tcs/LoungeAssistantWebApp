'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://user:password@ds153003.mlab.com:53003/sia-loungeassistant-dev'
  },
  seedDB: false,
  bot:{
    appId: "3c230dca-076d-46e8-8357-f12127fc467f",
    appPassword: "5j2HE9XzyoJr0hoqmq7mKAR"
  },
  luisEndpoint: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6066d9ee-4cf0-49e7-879e-86d7efee96d8?subscription-key=3e7af6f57fff4a409e242414178db93e&staging=true&verbose=true&timezoneOffset=0"
};
