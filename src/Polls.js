const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
const date = moment().format('YYYY-MM-DD HH:mm:ss');

mongoose.set('useFindAndModify', false);
var User = require('../src/User.js');

var pollSchema = new Schema({
    "board": Number,
    "title": String,
    "author": String,
    "body": String,
    "isClosed": Boolean,
    "views": { type: Number, default: 0 },
    "hasVoted": [String],
    "postDate": {
        type: String,
        default: date
    },

    "option1": String,
    "option1Num": { type: Number, default: 0 },
    "option1Male": { type: Number, default: 0 },
    "option1Female": { type: Number, default: 0 },
    "option1_10": { type: Number, default: 0 },
    "option1_20": { type: Number, default: 0 },
    "option1_25": { type: Number, default: 0 },
    "option1_30": { type: Number, default: 0 },
    "option1_35": { type: Number, default: 0 },
    "option1_40": { type: Number, default: 0 },

    "option2": String,
    "option2Num": { type: Number, default: 0 },
    "option2Male": { type: Number, default: 0 },
    "option2Female": { type: Number, default: 0 },
    "option2_10": { type: Number, default: 0 },
    "option2_20": { type: Number, default: 0 },
    "option2_25": { type: Number, default: 0 },
    "option2_30": { type: Number, default: 0 },
    "option2_35": { type: Number, default: 0 },
    "option2_40": { type: Number, default: 0 },

    "totalCount": { type: Number, default: 0 }
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
                    var num = data.option1Num;
                    num++;
                    var total = num + data.option2Num;
                    Polls.updateOne(
                        { _id: pollData },
                        { $set: { option1Num: num } }
                    ).then(() => {
                        Polls.updateOne(
                            { _id: pollData },
                            { $set: { totalCount: total } }
                        ).then(() => {
                            Polls.findOneAndUpdate(
                                { _id: pollData },
                                { $push: { hasVoted: curUser.userName } }
                            ).then(() => {
                                Polls.findOne({ _id: pollData }).then((data_g) => {

                                    if (curUser.gender == 1) {
                                        var cur = data_g.option1Male;
                                        cur++;
                                        console.log(cur);
                                        Polls.findOneAndUpdate(
                                            { _id: pollData },
                                            { $set: { option1Male: cur } }
                                        ).exec()
                                    } else if (curUser.gender == 2) {
                                        var cur = data_g.option1Female;
                                        cur++;
                                        Polls.findOneAndUpdate(
                                            { _id: pollData },
                                            { $set: { option1Female: cur } }
                                        ).exec()
                                    }

                                }).then(() => {
                                    Polls.findOne({ _id: pollData }).then((data_a) => {
                                        if (curUser.age == 10) {
                                            var cur = data_a.option1_10;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_10: cur } }
                                            ).exec()
                                        } else if (curUser.age == 20) {
                                            var cur = data_a.option1_20;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_20: cur } }
                                            ).exec()
                                        } else if (curUser.age == 25) {
                                            var cur = data_a.option1_25;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_25: cur } }
                                            ).exec()
                                        } else if (curUser.age == 30) {
                                            var cur = data_a.option1_30;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_30: cur } }
                                            ).exec()
                                        } else if (curUser.age == 35) {
                                            var cur = data_a.option1_35;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_35: cur } }
                                            ).exec()
                                        } else if (curUser.age == 40) {
                                            var cur = data_a.option1_40;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option1_40: cur } }
                                            ).exec()
                                        }
                                    }).then(() => {
                                        Polls.findOne({ _id: pollData }).then((updatedData) => {
                                            console.log(updatedData);
                                            resolve(updatedData);
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                else {
                    Polls.findOne({ _id: pollData }).then((data) => {
                        reject(data);
                    })
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
                    var num = data.option2Num;
                    num++;
                    var total = num + data.option1Num;
                    Polls.updateOne(
                        { _id: pollData },
                        { $set: { option2Num: num } }
                    ).then(() => {
                        Polls.updateOne(
                            { _id: pollData },
                            { $set: { totalCount: total } }
                        ).then(() => {
                            Polls.findOneAndUpdate(
                                { _id: pollData },
                                { $push: { hasVoted: curUser.userName } }
                            ).then(() => {
                                Polls.findOne({ _id: pollData }).then((data_g) => {

                                    if (curUser.gender == 1) {
                                        var cur = data_g.option2Male;
                                        cur++;
                                        console.log(cur);
                                        Polls.findOneAndUpdate(
                                            { _id: pollData },
                                            { $set: { option2Male: cur } }
                                        ).exec()
                                    } else if (curUser.gender == 2) {
                                        var cur = data_g.option2Female;
                                        cur++;
                                        Polls.findOneAndUpdate(
                                            { _id: pollData },
                                            { $set: { option2Female: cur } }
                                        ).exec()
                                    }

                                }).then(() => {
                                    Polls.findOne({ _id: pollData }).then((data_a) => {
                                        if (curUser.age == 10) {
                                            var cur = data_a.option2_10;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_10: cur } }
                                            ).exec()
                                        } else if (curUser.age == 20) {
                                            var cur = data_a.option2_20;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_20: cur } }
                                            ).exec()
                                        } else if (curUser.age == 25) {
                                            var cur = data_a.option2_25;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_25: cur } }
                                            ).exec()
                                        } else if (curUser.age == 30) {
                                            var cur = data_a.option2_30;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_30: cur } }
                                            ).exec()
                                        } else if (curUser.age == 35) {
                                            var cur = data_a.option2_35;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_35: cur } }
                                            ).exec()
                                        } else if (curUser.age == 40) {
                                            var cur = data_a.option2_40;
                                            cur++;
                                            Polls.findOneAndUpdate(
                                                { _id: pollData },
                                                { $set: { option2_40: cur } }
                                            ).exec()
                                        }
                                    }).then(() => {
                                        Polls.findOne({ _id: pollData }).then((updatedData) => {
                                            console.log(updatedData);
                                            resolve(updatedData);
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                else {
                    Polls.findOne({ _id: pollData }).then((data) => {
                        reject(data);
                    })
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
