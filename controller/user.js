const UserModel = require('../models/user')
const bcrypt = require('bcrypt')

const createNewUser = async(req, res, next) => {
    try {
        console.log('bd', req.body)
        const { username, password } = req.body
        if (!username || !password) {
            req.flash('error', 'username and password is required')
            res.redirect('/register')
            return false
        }
        const IsUsername = await UserModel.findOne({ username: username })
            // Nếu tồn tại username thì báo lỗi
        if (IsUsername) {
            req.flash('error', 'username is already in used')
            res.redirect('/register')
        }
        const newUser = new UserModel({ username, password })
        await newUser.save()
        return res.redirect('/login')
    } catch (error) {
        next(error)
    }
}

const checkLoginUser = async(req, res, next) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })
    if (!user) {
        req.flash('error', 'username is not exist')
        res.redirect('/login')
        return false
    }
    const IsPassword = await bcrypt.compare(password, user.password);
    if (IsPassword) {
        req.session.user = user;
        // Đưa ra user và pathfile nếu có
        req.flash('user', req.session.user)
        req.flash('PathUploadFile', user.avatar)
        return res.redirect('/files/upload')
    } else {
        req.flash('error', 'username or password is not exact')
        res.redirect('/login')
        return false

    }
}

const updateInfoUser = async(req, res, next) => {
    try {
        // Lấy thông tin body
        const { avatar, displayName } = req.body;
        // Lấy ra thông tin user lưu trong session
        const user = req.session.user;
        // Tìm user trong db
        const IsUser = await UserModel.findOne({ _id: user._id })
        if (!IsUser) {
            throw new Error('User is not founded')
        }
        await UserModel.findByIdAndUpdate(IsUser._id, { displayName: displayName, avatar: avatar });
        // Tìm user trong db
        const updateUser = await UserModel.findOne({ _id: user._id });
        console.log('up', updateUser);
        // cập nhật lại user và avatar
        req.flash('user', updateUser);
        req.flash('PathUploadFile', updateUser.avatar)
            // Redirect lại trang /files/upload
        return res.redirect('/files/upload')
    } catch (error) {
        next(error)
    }
}

module.exports = { createNewUser, checkLoginUser, updateInfoUser }