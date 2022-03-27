const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// Tạo 1 model
const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
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

// Mã hóa mật khẩu
UserSchema.pre('save', function(next) {
    // Tạo salt
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    // Băm mật khẩu
    const hashPassword = bcrypt.hashSync(this.password, salt);
    // Gắn mật khẩu
    this.password = hashPassword
    next()
})

// Truy cập vào 1 model
const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel