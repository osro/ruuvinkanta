const ruuvi = require('node-ruuvitag');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

ruuvi.on('found', tag => {
  console.log('Found RuuviTag, id: ' + tag.id);
  tag.on('updated', data => {
    console.log('Got data from RuuviTag ' + tag.id + ':\n' +
      JSON.stringify(data, null, '\t'));
  });
});

ruuvi.on('warning', message => {
  console.error(new Error(message));
});