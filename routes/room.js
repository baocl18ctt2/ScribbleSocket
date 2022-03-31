const express = require('express')
const roomRouter = express.Router()
const { checkSession } = require('../controller/auth')
const { createRoom } = require('../controller/room')

roomRouter.route('/Create')
    .get((req, res, next) => {
        res.render('play')
    })
    .post(createRoom)

module.exports = { roomRouter }