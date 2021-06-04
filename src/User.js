const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var userSchema = new Schema({
  "userName": {
      type: String,
      unique: true
  },
  "password": String,
  "age": Number,
  "gender": Number
});

var User = mongoose.model("users", userSchema);

module.exports = User;