const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const postSchema = new Schema({
    author : {
        type : ObjectId, 
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
        // dictionary 타입으로(선택지를 key값으로, value는 voteCount
    },
    isClosed : Boolean,
    postDate :  { type : Date, default : Date.now }, // 현재시간 자동 받음
});

/*
https://youwaytogo.tistory.com/55 // 실시간 투표 시스템 socket.io 제외하고
https://github.com/bghgu/project_vote_info // 성공회대 프로젝트 투표 시스템
https://miryang.dev/2019/04/02/nodejs-page-1/ // 홈페이지 만들기 처음부터
*/
