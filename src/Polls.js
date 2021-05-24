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
    "option1Num": { type: Number, default: 0 },
    "option2": String,
    "option2Num": { type: Number, default: 0 },
    "isClosed": Boolean,
    "postDate": {
        type: String,
        default: date
    },
    "views": { type: Number, default: 0 }
});

var Polls = mongoose.model('polls', pollSchema);

// ---------------------------------------------------
//게시물 만드는 함수
module.exports.createPoll = function (pollData, curUser) {
    return new Promise(function (resolve, reject) {
        let newPoll = new Polls(pollData);
        newPoll.author = curUser.userName;
        newPoll.save((err) => {
            if (err) {
                console.log(err);
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
        Polls.find({ board: 1 })
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
        Polls.find({ board: 2 })
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
        Polls.find({ board: 3 })
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
        Polls.find({ board: 4 })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

//------------------------------------------------------------

// id에 따라 게시물 가져오고 조회수 올리는 함수
module.exports.getPollById = function (pollData) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData })
            .then((data) => {
                var cur = data.views;
                cur++;
                Polls.updateOne(
                    { _id: pollData },
                    { $set: { views: cur } }
                ).exec()
                    .then(() => {
                        Polls.findOne({ _id: pollData }).then((updatedData) => {
                            resolve(updatedData);
                        })
                    })
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

//------------------------------------------------------------

// 옵션1 클릭할때마다 올라가고 데이터저장
module.exports.increOpt1 = function (pollData) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData })
            .then((data) => {
                var cur = data.option1Num;
                cur++;
                Polls.updateOne(
                    { _id: pollData },
                    { $set: { option1Num: cur } }
                ).exec()
                    .then(() => {
                        Polls.findOne({ _id: pollData }).then((updatedData) => {
                            resolve(updatedData);
                        })
                    })
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}


// 옵션2 클릭할때마다 올라가고 데이터저장
module.exports.increOpt2 = function (pollData) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData })
            .then((data) => {
                var cur = data.option2Num;
                cur++;
                Polls.updateOne(
                    { _id: pollData },
                    { $set: { option2Num: cur } }
                ).exec()
                    .then(() => {
                        Polls.findOne({ _id: pollData }).then((updatedData) => {
                            resolve(updatedData);
                        })
                    })
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

//------------------------------------------------------------

// 내 투표 가져오기
module.exports.getPollsByUser = function (curUser) {
    return new Promise(function (resolve, reject) {
        console.log(curUser);
        Polls.find({ author: curUser.userName })
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}