const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Tạo 1 model
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
    displayName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    uicolor: { type: String, default: "green" }
}, {
    createdAt: 'createdAt',
    updateAt: 'updateAt'
})

// Thêm chỉ số index
UserSchema.index({ email: 1, createdAt: 1, updateAt: 1 })

// Truy cập vào 1 model
const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel