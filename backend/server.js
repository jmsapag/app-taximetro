const express = require('express')

const app = express()

const registerRoutes = require('./routes/registers')

app.get("/api", (req, res) => {
    res.json({"users": ["one", "two"]})
})
/*
// middleware
app.use(express.json())

app.use( (req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/registers', registerRoutes)*/


app.listen(4000, () => { console.log("Server started on port 4000")})