const express = require('express')
const fileRouter = express.Router()
const uploadFiles = require('../controller/uploadAvatar')
const { checkSession } = require('../controller/auth')

fileRouter.route('/upload')
    .get(checkSession, (req, res, next) => {
        // check đã tồn tại req.file hay chưa
        if (!req.file) {
            req.flash('PathUploadFile', " ")
        }
        res.render('home', { user: req.flash('user')[0], uploadFile: req.flash('PathUploadFile')[0] })
    })
    .post(uploadFiles.uploadAvatar, (req, res, next) => {
        req.flash('PathUploadFile', req.file.filename)
        res.redirect('/files/upload')
    })

module.exports = fileRouter