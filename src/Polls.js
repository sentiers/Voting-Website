const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
const date = moment().format('YYYY-MM-DD HH:mm:ss');

mongoose.set('useFindAndModify', false);

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
    "views": { type: Number, default: 0 },
    "hasVoted": [String]
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
module.exports.increOpt1 = function (pollData, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData })
            .then((data) => {
                var check = false;
                for (i = 0; i < data.hasVoted.length; i++) {
                    if (data.hasVoted[i] == curUser.userName) {
                        check = true
                        break;
                    }
                }
                if (check == false) {
                    var cur = data.option1Num;
                    cur++;
                    Polls.updateOne(
                        { _id: pollData },
                        { $set: { option1Num: cur } }
                    ).then(() => {
                        Polls.findOneAndUpdate(
                            { _id: pollData },
                            { $push: { hasVoted: curUser.userName } }
                        ).then(() => {
                            Polls.findOne({ _id: pollData }).then((updatedData) => {
                                resolve(updatedData);
                            })
                        })
                    })
                }
                else {
                    reject("you already voted");
                }
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}


// 옵션2 클릭할때마다 올라가고 데이터저장
module.exports.increOpt2 = function (pollData, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData })
            .then((data) => {
                var check = false;
                for (i = 0; i < data.hasVoted.length; i++) {
                    if (data.hasVoted[i] == curUser.userName) {
                        check = true
                        break;
                    }
                }
                if (check == false) {
                    var cur = data.option2Num;
                    cur++;
                    Polls.updateOne(
                        { _id: pollData },
                        { $set: { option2Num: cur } }
                    ).then(() => {
                        Polls.findOneAndUpdate(
                            { _id: pollData },
                            { $push: { hasVoted: curUser.userName } }
                        ).then(() => {
                            Polls.findOne({ _id: pollData }).then((updatedData) => {
                                resolve(updatedData);
                            })
                        })
                    })
                }
                else {
                    reject("you already voted");
                }
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
        Polls.find({ author: curUser.userName })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
}

// 여기말고 위에에
// //이미 투표했는지
// // module.exports.ifVoted = function (curUser) {
// //     var check = false;
// //     for( var i = 0; i < Polls.hasVoted.lenght; i++ ){
// //         if(Polls.hasVoted[i] == curUser.userName){
// //             check = true;
// //             break;
// //         }
// //     }
// //     return check;
// // }

// // ifVoted = function(curUser){
// //     var check = false;
// //     for(var i = 0; i < pollData.hasVoted.length; i++){
// //         if(pollData.hasVoted[i] == curUser.userName){
// //             check = true;
// //             break;
// //         }
// //     }

// //     return check;
// // }