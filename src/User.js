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
  "loginHistory": [{
      "dateTime": Date,
      "userAgent": String
  }],
  "voteRecord" : [{String}]
});

var User = mongoose.model("users", userSchema);

module.exports = User;