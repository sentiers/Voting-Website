const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // 닉네임
    userID: { type: String, required: true }, //id
    age: { type: Number, required: true },
    gender: { type: Number, required: true },
    voteHistory: [],
    password: { type: String, required: true }
}, { timestamps: true }) // 타임스탬프 필요한가여..??

// 유저가 한 투표 voteHistory 배열에 push
userScheme.methods.hasVoted =  function(postNum){ 
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


const User = mongoose.model('user', UserSchema)
module.exports = { User }

// userRoute에 넣어야 할 function
// getpolldata (userid, req, res, next)
// getpollbyid (id, req, res, next)
// addpolltouser (pollid, req, res, next)
// addpollsoffline (pollid, req, res, next)
// https://github.com/imtoobose/voting-app/blob/master/app/routes/addpolls.js
// 여기에 있는 함수를 User Schema에 맞게

// voteHistory 배열방식으로 수정했어요!