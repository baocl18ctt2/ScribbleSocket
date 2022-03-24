const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan');
// import routes
const { routeConfig } = require('./routes/index')

// Kết nối DB
const db = require('./configs/db')
db.connectDb()

// Cài đặt môi trường view engines
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', "ejs")

// Middleware
app.use(logger('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'mit',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, expires: 60 * 60 * 24 }
}))
app.use(flash())

// Thiết lập flash-keys
app.use(function(req, res, next) {
    res.locals.error_messages = req.flash('error')
    res.locals.success_messages = req.flash('success')
    next()
})

// Đường dẫn gốc
app.use('/', routeConfig);

// Ko tìm thấy đường dẫn
app.get('*', (req, res, next) => {
    const err = new Error('404 Not Found')
    err.status = 404
    next(err)
});

// Bắt lỗi
app.get((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500
    return res.status(status).json({
        error: error.message
    })
});

module.exports = app