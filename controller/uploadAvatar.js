const multer = require('multer')
const uuid = require('uuid').v4

// Cấu hình thư mục lưu trữ file
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsFile/')
    },
    filename: (req, file, cb) => {
        const { originalname } = file
        cb(null, `${uuid()}-${originalname}`)
    }
})

const upload = multer({ storage: storageConfig })
const uploadAvatar = upload.single('avatar')

module.exports = { uploadAvatar }