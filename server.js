const app = require('./app')
const http = require('http')

const server = http.createServer(app)

// Khởi tạo server
const port = process.env.port | 3000
server.listen(port, () => {
    console.log('Server is listening' + port);
})