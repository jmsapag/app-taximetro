
// SERVER/CONTROLLER

const express = require('express')
const app = express()
const port = 4000
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const alerts = []

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

app.get('/alerts', (req, res) => {
    res.json(alerts);
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
        case 'esp/res/emergency':
            emergencyAlerts(JSON.parse(message.toString()));
            break;
        default:
            console.log('Topic no reconocido');
    }
});

// SERVICE

function publishMessage() {
    return new Promise((resolve, reject) => {
        console.log("Publicando mensaje...");
        appClient.publish('bd/req/register', JSON.stringify({hola: "hola"}));
        console.log("Mensaje publicado");

        appClient.on("message", function (topic, message) {
            console.log("Mensaje recibido en el tópico:", topic);
            if (topic === 'bd/res/register') {
                console.log("Respuesta recibida");
                resolve(JSON.parse(message.toString()));
            }
        });
    });
}

module.exports = { appClient, publishMessage };


// WEBSOCKETS

function emergencyAlerts(json) {

    const alertIndex = alerts.findIndex(alert => alert.id === json.id);

    if (alertIndex === -1) {
        alerts.push(json); // Add new alert if it doesn't exist
    } else {
        alerts.splice(alertIndex, 1); // Remove alert if it already exists
    }

    broadcast(JSON.stringify(json));
}

function broadcast(data) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

server.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('message', message => {
        console.log('Mensaje recibido:', message);
        console.log(message)
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});