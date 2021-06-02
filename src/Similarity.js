const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var similaritySchema = new Schema({
  "user1": String,
  "user2": String,
  
  "same1": Number,
  "diff1": Number,
  "same2": Number,
  "diff2": Number,
  "same3": Number,
  "diff3": Number,
  "same4": Number,
  "diff4": Number,
});

var Similarity = mongoose.model("similarities", similaritySchema);

module.exports = Similarity;