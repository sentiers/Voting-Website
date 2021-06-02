const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var similaritySchema = new Schema({
  "user1": String,
  "user2": String,
  
  "same1": { type: Number, default: 0 },
  "diff1": { type: Number, default: 0 },
  "same2": { type: Number, default: 0 },
  "diff2": { type: Number, default: 0 },
  "same3": { type: Number, default: 0 },
  "diff3": { type: Number, default: 0 },
  "same4": { type: Number, default: 0 },
  "diff4": { type: Number, default: 0 },
});

var Similarity = mongoose.model("similarities", similaritySchema);

module.exports = Similarity;