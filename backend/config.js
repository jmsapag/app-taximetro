var config = {};

config.debug = process.env.DEBUG || true;

config.mqtt  = {};
config.mqtt.namespace = process.env.MQTT_NAMESPACE || '#';
config.mqtt.hostname  = process.env.MQTT_HOSTNAME  || '50.19.236.246';
config.mqtt.port      = process.env.MQTT_PORT      || 1883;

module.exports = config;