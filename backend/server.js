
// SERVER/CONTROLLER

const express = require('express')
const app = express()
const port = 4000

require("dotenv").config();

app.get("/registers", async (req, res) => {
    try {
        const message = await publishMessage();
        res.send(message);
    } catch (error) {
        console.error("Error al publicar o recibir el mensaje:", error);
        res.status(500).json({ error: "Error al obtener el mensaje" });
    }
});

app.listen(port, () => { console.log(`Example app listening on port ${port}`); })


// SERVICE

const mqtt = require("mqtt");
const config = require("./config");
const mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
const appClient = mqtt.connect(mqttUri);

// subscribe to a topic
appClient.on("connect", () => {
    appClient.subscribe(['bd/res/register', 'esp/res/emergency'], (err) => {
        if (!err) {
            console.log("App client connected");
        }
    });
});

// handle received messages from the subscribed topics
appClient.on('message', function (topic, message) {
    // make something depending on the topic, emergency case and get all register
    switch (topic) {
        case 'bd/res/register':
            break;
        case 'esp/res/emergency':
            app.get("/emergency", (req, res) => {
                res.send(message)
            })
            break;
        default:
            console.log('Topic no reconocido');
    }
});

// SERVICE

function publishMessage() {
    return new Promise((resolve, reject) => {
        console.log("Publicando mensaje...");
        appClient.publish('bd/req/register', "hola");
        console.log("Mensaje publicado");

        appClient.on("message", function (topic, message) {
            console.log("Mensaje recibido en el tópico:", topic);
            if (topic === 'bd/res/register') {
                console.log("Respuesta recibida:", message.toString());
                resolve(JSON.parse(message.toString()));
            }
        });
    });
}


module.exports = { appClient, publishMessage };
