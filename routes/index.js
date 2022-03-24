const express = require('express')
const routeConfig = express.Router()
const path = require('path')
routeConfig.route('/')
    .get((req, res, next) => {
        res.render('index')
    })

routeConfig.route('/register')
    .get((req, res, next) => {
        req.flash("error", "username and password is required12")
        res.render('register')
    })
    .post((req, res, next) => {
        const { username, password } = req.body
        if (!username || !password) {
            console.log(username, password)
            req.flash('error', 'username and password is required')
            res.render('register')
            return false
        }
        res.send('ok')
    })

module.exports = { routeConfig }