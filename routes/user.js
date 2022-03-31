const express = require('express')
const userRouter = express.Router()
const { updateInfoUser, getDetailUser } = require('../controller/user')
const { validateParams, validateBody, schema } = require('../validator/routerValidator')

userRouter.route('/update')
    .post(validateBody(schema.UserBodySchema), updateInfoUser)

// Test user
userRouter.route('/:UserId')
    .get(validateParams(schema.IdSchema, 'UserId'), getDetailUser)
module.exports = { userRouter }