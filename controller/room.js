const RoomModel = require('../models/room')
const uuid = require('uuid').v4;

const createRoom = async(req, res, next) => {
    // Lấy ra dữ liệu của user
    const user = req.session.user;
    // kiểm tra có phòng room nào user đó thuộc về chưa? Nếu có thì xóa tất cả các phòng, còn không thì tạo phòng mới
    const RoomFounded = await RoomModel.find({ owner: user._id });
    if (RoomFounded) {
        // Xóa tất cả các phòng tránh trường hợp spam room
        await Promise.all(RoomFounded.map(async(room) => {
            await room.remove();
        }))
    }
    // Tạo phòng mới
    const newRoom = new RoomModel({
        code: uuid(),
        owner: user._id
    })
    await newRoom.save()
    console.log(newRoom);
}

module.exports = { createRoom }