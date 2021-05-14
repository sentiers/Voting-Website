const mongoose = require('mongoose')

const UserShcema = new mongoose.Schema({
    username : { type: String, required: true, unique: true}, // 닉네임
    userID : { type: String, required: true}, //id
    age : { type: Number, required: true},
    gender : { type: Number, required: true},
    voteHistory : String,
    password : { type: String, required: true}
}, {timestamps: true}) // 타임스탬프 필요한가여..??

const User = mongoose.model('user', UserSchema)
module.exports = { User }