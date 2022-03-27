const express = require('express')
const userRouter = express()
const { updateInfoUser } = require('../controller/user')
userRouter.route('/update')
    .post(updateInfoUser)

module.exports = { userRouter }