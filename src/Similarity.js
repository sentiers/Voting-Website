const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var similaritySchema = new Schema({
  "user1": String, //비교할 두명의 유저
  "user2": String,
  
  "same1": { type: Number, default: 0 }, // 음식게시판에서 같은거
  "diff1": { type: Number, default: 0 }, // 음식게시판에서 다른거
  "same2": { type: Number, default: 0 }, 
  "diff2": { type: Number, default: 0 },
  "same3": { type: Number, default: 0 },  
  "diff3": { type: Number, default: 0 },
  "same4": { type: Number, default: 0 }, // 자유게시판
  "diff4": { type: Number, default: 0 }, 

  "sim1": { type: Number, default: 0 },  
  "sim2": { type: Number, default: 0 },
  "sim3": { type: Number, default: 0 }, // 자유게시판
  "sim4": { type: Number, default: 0 }
});

var Similarity = mongoose.model("similarities", similaritySchema);

module.exports = Similarity;
