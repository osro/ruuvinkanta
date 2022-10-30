const ruuvi = require("node-ruuvitag");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const ruuviTagsToRead = require("./ruuviTagsToRead.json");
const interval = 900000; // 15mins in millisedoncs

console.log("Starting RuuviTag reader for macs", ruuviTagsToRead.macs);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

ruuvi.on("found", (tag) => {
  if (ruuviTagsToRead.macs.includes(tag.id)) {
    console.log("Found RuuviTag, id: " + tag.id);
    var lastUpdate = null;

    tag.on("updated", (data) => {
      if (lastUpdate === null || new Date() - lastUpdate > interval) {
        console.log(
          "Got data from RuuviTag " +
            tag.id +
            ":\n" +
            JSON.stringify(data, null, "\t")
        );
        db.collection("datapoints").add({
          dataFormat: data.dataFormat,
          rssi: data.rssi,
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
          accelerationX: data.accelerationX,
          accelerationY: data.accelerationY,
          accelerationZ: data.accelerationZ,
          battery: data.battery,
          txPower: data.txPower,
          movementCounter: data.movementCounter,
          measurementSequenceNumber: data.measurementSequenceNumber,
          mac: data.mac,
          timestamp: admin.firestore.Timestamp.now(),
        });
        lastUpdate = Date.now();
      } else {
        console.log("Interval not reached, skipping update", tag.id);
      }
    });
  }
});

ruuvi.on("warning", (message) => {
  console.error(new Error(message));
});
