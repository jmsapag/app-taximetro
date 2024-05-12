
const express = require('express')
const app = express()
const port = 4000

require("dotenv").config();

const registerRoutes = require('./routes/registers')

app.get("/api", (req, res) => {
    res.json({"users": ["one", "two"]})
})

app.get("/mqttConnDetails", (req, res) => {
    res.send(
        JSON.stringify({
            mqttServer: process.env.MQTT_BROKER,
            mqttTopic: process.env.MQTT_TOPIC,
        })
    );
});

// middleware
app.use(express.json())

app.use( (req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/registers', registerRoutes)

app.listen(port, () => { console.log(`Example app listening on port ${port}`); })