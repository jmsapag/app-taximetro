const express = require('express')

const router = express.Router()

// get all registers
router.get('/', (req, res) => {
    res.json({mssg: 'GET all registers'})
})

// get one register
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET one register'})
})

// post a new register
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new register'})
})

// delete a register
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a register'})
})

// update a register
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a register'})
})

module.exports = router