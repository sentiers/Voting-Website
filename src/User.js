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
  "my_vote" : [String],
  "vote_record" : [String],
  "yousado~" : {
      "board1" : [{
          "비교user": {
              "same" : Number,
              "diff" : Number
          }
      }],
      "board2" : [{
          "비교user": {
              "same" : Number,
              "diff" : Number
          }
      }],
      "board3" : [{
          "비교user": {
              "same" : Number,
              "diff" : Number
          }
      }],
      "board4" : [{
          "비교user": {
              "same" : Number,
              "diff" : Number
          }
      }] // 의도 표현입니다...될지 안될지는 몰라요 ㅎ..
  }
});


// 유저가 한 투표 voteHistory 배열에 push
userSchema.methods.hasVoted =  function(postNum){ 
    var check = false;
    for(var i=0; i<this.voteHistory.length; i++){
      if(this.voteHistory[i] ==  postNum){
        check= true;
        break;
      }
    }
    // 이미 User가 투표한 적 있으면 check에 true return
  
    if(check==false){
      this.votedPolls.push(postNum);
    }
    // User가 투표한 적 없는 투표이면 check에 false return

    return;
  }


var User = mongoose.model("users", userSchema);
module.exports = User;

// userRoute에 넣어야 할 function
// GET POLLS BELONGING TO USER
// addpolltouser (pollid, req, res, next)
// addpollsoffline (pollid, req, res, next)
// https://github.com/imtoobose/voting-app/blob/master/app/routes/addpolls.js
// 여기에 있는 함수를 User Schema에 맞게