const mongoose = require('mongoose')

// Kết nối mongoDB
const connectDb = async() => {
    try {
        await mongoose.connect('mongodb://localhost/scribble_socket', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect DB is success')
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = { connectDb }