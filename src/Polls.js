const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
const date = moment().format('YYYY-MM-DD HH:mm:ss');

//var User = require('./User.js');

var pollSchema = new Schema({
    "board": Number,
    "title": String,
    "author": String,
    "body": String,
    "option1": String,
    "option2": String,
    "isClosed": Boolean,
    "postDate": {
        type: String,
        default: date
    }
});

var Polls = mongoose.model('polls', pollSchema);

// ---------------------------------------------------
//게시물 만드는 함수
module.exports.createPoll = function (pollData) { 
    return new Promise(function (resolve, reject) {
        let newPoll = new Polls(pollData);
        //newPoll.author = req.body.userName;(이런식으로 쓰기도하던데.. userData.userName으로 하면 되려나..?)
        newPoll.save((err) => {
            if (err) {
                console.log (err);
                reject();
            } else {
                resolve();
            }
        }
        )
    });
};


// ---------------------------------------------------
// 모든 음식관련 게시물 가져오는함수
module.exports.getAllFood = function () {
    return new Promise(function (resolve, reject) {
        Polls.find({ board: 1})
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

// 모든 연애관련 게시물 가져오는함수
module.exports.getAllRelationship = function () {
    return new Promise(function (resolve, reject) {
        Polls.find({ board: 2})
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

// 모든 패션관련 게시물 가져오는함수
module.exports.getAllFashion = function () {
    return new Promise(function (resolve, reject) {
        Polls.find({ board: 3})
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

// 모든 자유관련 게시물 가져오는함수
module.exports.getAllFree = function () {
    return new Promise(function (resolve, reject) {
        Polls.find({ board: 4})
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

// 내 투표 가져오기

// module.exports.getMYFood = function () {
//     return new Promise(function (resolve, reject) {
//         Polls.find({author: userName})
//             .then((data) => {
//                 resolve(data);
//             })
//             .catch((err) => {
//                 reject("no results returned");
//             });
//     });
}

// ---------------------------------------------------

