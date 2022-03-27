const express = require('express')
const routeConfig = express.Router()
const path = require('path')
const { checkSession } = require('../controller/index')
const { createNewUser, checkLoginUser } = require('../controller/user')
routeConfig.route('/')
    .get(checkSession, (req, res, next) => {
        res.render('index', { user: req.flash('user')[0] })
    })

routeConfig.route('/register')
    .get((req, res, next) => {
        req.flash("error", "username and password is required12")
        res.render('register')
    })
    .post(createNewUser)

routeConfig.route('/login')
    .get((req, res, next) => {
        res.render('login')
    })
    .post(checkLoginUser)

module.exports = { routeConfig }