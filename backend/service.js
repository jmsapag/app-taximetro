
const mqtt = require("mqtt");
const config = require("./config");
const mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
const client = mqtt.connect(mqttUri);
const appClient = mqtt.connect(mqttUri);

