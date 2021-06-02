const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var userSchema = new Schema({
  "userName": {
      type: String,
      unique: true
  },
  "password": String,
  "age": Number,
  "gender": Number,
  "voteRecord" : [String] // string: 게시판넘버(1자리)/게시물_id(24자리)/옵션선택(1자리)
});

var User = mongoose.model("users", userSchema);

module.exports = User;