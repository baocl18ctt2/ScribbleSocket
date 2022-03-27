const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Tạo ra 1 schema
const RoomSchema = new Schema({
    code: { type: String, default: "" },
    maxPlayer: {},
    chat: [{
        message: { type: String },
        messageType: { type: string },
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    createdAt: 'createdAt',
    updateAt: 'updateAt'
})

// Truy cập vào 1 model
const RoomModel = mongoose.model('Room', RoomSchema)

module.exports = RoomModel