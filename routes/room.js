const express = require('express')
const roomRouter = express.Router()
const { checkSession } = require('../controller/auth')
const { createRoom } = require('../controller/room')

roomRouter.route('/Create')
    .get(checkSession, (req, res, next) => {
        res.send('create room OK')
    })
    .post(createRoom)

module.exports = { roomRouter }