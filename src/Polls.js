var 
  mongoose= require('mongoose');
  Schema = mongoose.Schema;

var PollSchema = new Schema({
    title :  { // 투표 제목
        type : String,
        required : [true, '제목을 넣어주세요!'],
    },

  author : { // 글쓴이
    type : mongoose.Schema.Types.ObjectId, // 고유 id 받아옴 나중에 model.populate 이용해서 name 받아오세용
    required : true,
    ref : 'User', // user.js 스키마의 id를 참조함 - userd와 Board 연결
},

postNum :  { // 글 고유번호
    type : String,
    required : true,
},

  options: [{ // 선택지
    optionName: String,
    votes: Number
  }],

  isClosed : Boolean, // 마감 여부
  postDate :  { type : Date, default : Date.now },
  // 현재시간 - 자동으로 받아서 게시판 글 목록에서 정렬
});

PollSchema.methods.updateVotes = function(optionnumber){
  if(typeof optionnumber === 'number' && optionnumber<this.options.length){
    this.options[optionnumber].votes+=1;
  }
}

var Polls = mongoose.model('Polls', PollSchema);
module.exports= Polls;

/*const { ObjectId } = require('bson');
const mongoose = require('mongoose');

// dictionary 타입으로 (선택지를 key값으로, value는 voteCount)
const voteSelectionSchema = new Schema({
    selection : {
        type : String,
    },
    voteCount : {
        type : Number,
    },
});

const postSchema = new Schema({
    author : {
        type : ObjectId, // 고유 id 받아옴 나중에 model.populate 이용해서 name 받아오세용
        required : true,
        ref : 'User', // user.js 스키마의 id를 참조함 - userd와 Board 연결
    },
    postNum :  {
        type : String,
        required : true,
    },

    Title :  {
        type : String,
        required : [true, '제목을 넣어주세요!'],
    },
    voteQuestion : {
        type : String,
        required : [true, '내용을 넣어주세요!'],
    },
    voteSelection : {
        type : [voteSelectionSchema],
    },
    isClosed : Boolean,
    postDate :  { type : Date, default : Date.now }, // 현재시간 자동 받음
});*/

/*
https://youwaytogo.tistory.com/55 // 실시간 투표 시스템 socket.io 제외하고
https://github.com/bghgu/project_vote_info // 성공회대 프로젝트 투표 시스템
https://miryang.dev/2019/04/02/nodejs-page-1/ // 홈페이지 만들기 처음부터
*/
