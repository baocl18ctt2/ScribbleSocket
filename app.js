const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const socket = require('socket.io')
const cors = require('cors')

// Gọi đến server khác
const http = require('http')
const server = http.createServer(app)
server.listen(8888)
const io = socket(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log('socket', socket.id);
    // Socket gửi socket.id
    socket.emit('setInstance', { id: socket.id });
    // Lắng nghe sự kiện start và gửi lại thông tin cho các client khác
    socket.on('start', function(result) {
        console.log('re', result)
        io.emit('startFromServer', { socketId: socket.id, ...result })
    });
    // Lắng nghe sự kiện draw và gửi lại thông tin cho các client khác
    socket.on('draw', (result) => {
        console.log('re1', result)
        io.emit('startDrawFromServer', { socketId: socket.id, ...result })
    });
    // Lắng nghe sự kiện stop
    socket.on('stop', function(result) {
        io.emit("stopFromServer", {...result, socketId: socket.id })
    });
    // Lắng nghe sự kiện thay đổi màu
    socket.on("changeColor", function(result) {
        io.emit("changeColorFromServer", {...result, socketId: socket.id })
    });
    // Lắng nghe sự kiện thay đổi tăng giảm kích cỡ vẽ
    socket.on("changeThinDrawer", function(result) {
        io.emit("changeThinDrawerFromServer", {...result, socketId: socket.id })
    });
    // Lắng nghe sự kiện clear
    socket.on("clear", function(result) {
        io.emit("clearFromServer", {...result, socketId: socket.id })
    });
    // Lắng nghe sự kiện undo
    socket.on("undo", function(result) {
        io.emit("undoFromServer", {...result, socketId: socket.id })
    });
    // Lắng nghe sự kiện chat
    socket.on("sendChat", function(result) {
        io.emit("sendChatFromServer", {...result, socketId: socket.id })
    })
})

// import routes
const { routeConfig } = require('./routes/index')
const uploadAvatarRouter = require('./routes/uploadAvatar')
const { userRouter } = require('./routes/user')
const { roomRouter } = require('./routes/room')

// Kết nối DB
const db = require('./configs/db')
db.connectDb()

// Cài đặt môi trường view engines
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', "ejs")

// Đường dẫn gốc
app.use('/static', express.static(__dirname + '/uploadsFile'))
app.use(express.static(__dirname + '/assets'))
app.use(express.static(__dirname + '/component'))

// Middleware
app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
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
        // res.locals.user = req.flash('user')
    next()
})

// Thiết lập router
app.use('/files', uploadAvatarRouter);
app.use('/users', userRouter);
app.use('/rooms', roomRouter);
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