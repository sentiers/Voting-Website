const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
const date = moment().format('YYYY-MM-DD HH:mm:ss');

var pollSchema = new Schema({
    "board": Number,
    "title": String,
    "author": String,
    "body": String,
    "option1": String,
    "option1Num": { type: Number, default: 0}, 
    "option2": String,
    "option2Num": { type: Number, default: 0}, 
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

// ---------------------------------------------------


module.exports.increOpt1 = function (pollData) {
    return new Promise(function (resolve, reject) {
        pollData.option1Num++;
        console.log("됐다능 " + pollData.option1Num);
        pollData.save((err) => {
            if (err) {
                console.log (err);
                reject();
            } else {
                resolve();
            }
        });
    });
}

module.exports.increOpt2 = function (pollData) {
    return new Promise(function (resolve, reject) {
        pollData.option2Num++;
        console.log("됐다능2 " + pollData.option2Num);
        newPoll.save((err) => {
            if (err) {
                console.log (err);
                reject();
            } else {
                resolve();
            }
        });
    });
}

// ---------------------------------------------------

