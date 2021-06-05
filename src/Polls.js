const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
require('moment-timezone');

const delay = require('delay');

// 서울시간으로 디폴트
moment.tz.setDefault("Asia/Seoul");
mongoose.set('useFindAndModify', false);
const Similarity = require('../src/Similarity.js');

var pollSchema = new Schema({
    "board": Number,
    "title": String,
    "author": String,
    "body": String,
    "views": { type: Number, default: 0 },
    "postDate": { type: String },

    "option1HasVoted": [String],
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

    "option2HasVoted": [String],
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
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        newPoll.author = curUser.userName;
        newPoll.postDate = date;
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
                for (i = 0; i < data.option1HasVoted.length; i++) {
                    if (data.option1HasVoted[i] == curUser.userName) {
                        check = true
                        break;
                    }
                }
                for (i = 0; i < data.option2HasVoted.length; i++) {
                    if (data.option2HasVoted[i] == curUser.userName) {
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
                    ).exec().then(() => {
                        Polls.updateOne(
                            { _id: pollData },
                            { $set: { totalCount: total } }
                        ).exec().then(() => {
                            Polls.findOneAndUpdate(
                                { _id: pollData },
                                { $push: { option1HasVoted: curUser.userName } }
                            ).exec().then(() => {
                                Polls.findOne({ _id: pollData }).then((data_g) => {

                                    if (curUser.gender == 1) {
                                        var cur = data_g.option1Male;
                                        cur++;
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
                for (i = 0; i < data.option1HasVoted.length; i++) {
                    if (data.option1HasVoted[i] == curUser.userName) {
                        check = true
                        break;
                    }
                }
                for (i = 0; i < data.option2HasVoted.length; i++) {
                    if (data.option2HasVoted[i] == curUser.userName) {
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
                    ).exec().then(() => {
                        Polls.updateOne(
                            { _id: pollData },
                            { $set: { totalCount: total } }
                        ).exec().then(() => {
                            Polls.findOneAndUpdate(
                                { _id: pollData },
                                { $push: { option2HasVoted: curUser.userName } }
                            ).exec().then(() => {
                                Polls.findOne({ _id: pollData }).then((data_g) => {

                                    if (curUser.gender == 1) {
                                        var cur = data_g.option2Male;
                                        cur++;
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
//유사도계산

// 이거 옵션선택1한경우에 실행되는 함수입니다!!!!!!
module.exports.similarityCal1 = function (Data, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: Data }).exec().then((data) => {

            const result1 = async (data) => {
                for (const user of data.option1HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;
                            console.log("-----option1-----counting---\n");

                            userA = user;
                            userB = curUser.userName;

                            if (userA != userB) {
                                console.log(userA + "-------------\n");
                                console.log(userB + "-------------\n");

                                Similarity.findOne({ user1: userA, user2: userB })
                                    .then((simData1) => {
                                        check1 = simData1;

                                        Similarity.findOne({ user1: userB, user2: userA })
                                            .then((simData2) => {
                                                check2 = simData2;
                                                if (check1) {
                                                    simData = check1;
                                                } else if (check2) {
                                                    simData = check2;
                                                } else {
                                                    simData = null;
                                                }

                                                console.log(simData + "-------Simmm------\n");

                                                if (simData) {
                                                    console.log("-------update------\n");
                                                    if (boardNum == 1) {
                                                        var cur = simData.same1;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same1: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 2) {
                                                        var cur = simData.same2;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same2: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 3) {
                                                        var cur = simData.same3;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same3: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 4) {
                                                        var cur = simData.same4;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same4: cur } }
                                                        ).exec()
                                                    }
                                                } else {

                                                    var newSim = new Similarity();
                                                    newSim.user1 = userA;
                                                    newSim.user2 = userB;

                                                    console.log(userA + userB);

                                                    if (boardNum == 1) {
                                                        newSim.same1 = 1;
                                                    } else if (boardNum == 2) {
                                                        newSim.same2 = 1;
                                                    } else if (boardNum == 3) {
                                                        newSim.same3 = 1;
                                                    } else if (boardNum == 4) {
                                                        newSim.same4 = 1;
                                                    }
                                                    console.log(newSim + "-------newSim------\n");
                                                    newSim.save();
                                                }
                                            })
                                    }).catch((err) => {
                                        console.log("1-1 error");
                                    })

                            }

                        })
                }
            }

            const result2 = async (data) => {
                for (const user of data.option2HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;

                            console.log("-----option2-----counting---\n");

                            userA = user;
                            userB = curUser.userName;

                            if (userA != userB) {
                                console.log(userA + "-------------\n");
                                console.log(userB + "-------------\n");

                                Similarity.findOne({ user1: userA, user2: userB })
                                    .then((simData1) => {
                                        check1 = simData1;
                                        Similarity.findOne({ user1: userB, user2: userA })
                                            .then((simData2) => {
                                                check2 = simData2;
                                                if (check1) {
                                                    simData = check1;
                                                } else if (check2) {
                                                    simData = check2;
                                                } else {
                                                    simData = null;
                                                }

                                                console.log(simData + "-------SimmmDIFF------\n");

                                                if (simData) {
                                                    console.log("-------update------\n");
                                                    if (boardNum == 1) {
                                                        var cur = simData.diff1;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff1: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 2) {
                                                        var cur = simData.diff2;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff2: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 3) {
                                                        var cur = simData.diff3;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff3: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 4) {
                                                        var cur = simData.diff4;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff4: cur } }
                                                        ).exec()
                                                    }
                                                } else {
                                                    var newSim = new Similarity();
                                                    newSim.user1 = userA;
                                                    newSim.user2 = userB;

                                                    if (boardNum == 1) {
                                                        newSim.diff1 = 1;
                                                    } else if (boardNum == 2) {
                                                        newSim.diff2 = 1;
                                                    } else if (boardNum == 3) {
                                                        newSim.diff3 = 1;
                                                    } else if (boardNum == 4) {
                                                        newSim.diff4 = 1;
                                                    }
                                                    console.log(newSim + "-------newSim------\n");
                                                    newSim.save()
                                                }
                                            })

                                    }).catch((err) => {
                                        console.log("1-2 error");
                                    })
                            }

                        })
                }
            }

            result1(data);
            result2(data);
            resolve();
        })

    });
}


// 이거는 옵션선택2한경우에 실행되는 함수입니다!!!!!!
module.exports.similarityCal2 = function (Data, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: Data }).exec().then((data) => {

            const result1 = async (data) => {
                for (const user of data.option2HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;
                            console.log("-----option1-----counting---\n");

                            userA = user;
                            userB = curUser.userName;

                            if (userA != userB) {
                                console.log(userA + "-------------\n");
                                console.log(userB + "-------------\n");

                                Similarity.findOne({ user1: userA, user2: userB })
                                    .then((simData1) => {
                                        check1 = simData1;

                                        Similarity.findOne({ user1: userB, user2: userA })
                                            .then((simData2) => {
                                                check2 = simData2;
                                                if (check1) {
                                                    simData = check1;
                                                } else if (check2) {
                                                    simData = check2;
                                                } else {
                                                    simData = null;
                                                }

                                                console.log(simData + "-------Simmm------\n");

                                                if (simData) {
                                                    console.log("-------update------\n");
                                                    if (boardNum == 1) {
                                                        var cur = simData.same1;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same1: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 2) {
                                                        var cur = simData.same2;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same2: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 3) {
                                                        var cur = simData.same3;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same3: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 4) {
                                                        var cur = simData.same4;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { same4: cur } }
                                                        ).exec()
                                                    }
                                                } else {

                                                    var newSim = new Similarity();
                                                    newSim.user1 = userA;
                                                    newSim.user2 = userB;

                                                    console.log(userA + userB);

                                                    if (boardNum == 1) {
                                                        newSim.same1 = 1;
                                                    } else if (boardNum == 2) {
                                                        newSim.same2 = 1;
                                                    } else if (boardNum == 3) {
                                                        newSim.same3 = 1;
                                                    } else if (boardNum == 4) {
                                                        newSim.same4 = 1;
                                                    }
                                                    console.log(newSim + "-------newSim------\n");
                                                    newSim.save();
                                                }
                                            })
                                    }).catch((err) => {
                                        console.log("1-1 error");
                                    })

                            }

                        })
                }
            }

            const result2 = async (data) => {
                for (const user of data.option1HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;

                            console.log("-----option2-----counting---\n");

                            userA = user;
                            userB = curUser.userName;

                            if (userA != userB) {
                                console.log(userA + "-------------\n");
                                console.log(userB + "-------------\n");

                                Similarity.findOne({ user1: userA, user2: userB })
                                    .then((simData1) => {
                                        check1 = simData1;
                                        Similarity.findOne({ user1: userB, user2: userA })
                                            .then((simData2) => {
                                                check2 = simData2;
                                                if (check1) {
                                                    simData = check1;
                                                } else if (check2) {
                                                    simData = check2;
                                                } else {
                                                    simData = null;
                                                }

                                                console.log(simData + "-------SimmmDIFF------\n");

                                                if (simData) {
                                                    console.log("-------update------\n");
                                                    if (boardNum == 1) {
                                                        var cur = simData.diff1;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff1: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 2) {
                                                        var cur = simData.diff2;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff2: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 3) {
                                                        var cur = simData.diff3;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff3: cur } }
                                                        ).exec()
                                                    } else if (boardNum == 4) {
                                                        var cur = simData.diff4;
                                                        cur++;
                                                        Similarity.findOneAndUpdate(
                                                            { user1: simData.user1, user2: simData.user2 },
                                                            { $set: { diff4: cur } }
                                                        ).exec()
                                                    }
                                                } else {
                                                    var newSim = new Similarity();
                                                    newSim.user1 = userA;
                                                    newSim.user2 = userB;

                                                    if (boardNum == 1) {
                                                        newSim.diff1 = 1;
                                                    } else if (boardNum == 2) {
                                                        newSim.diff2 = 1;
                                                    } else if (boardNum == 3) {
                                                        newSim.diff3 = 1;
                                                    } else if (boardNum == 4) {
                                                        newSim.diff4 = 1;
                                                    }
                                                    console.log(newSim + "-------newSim------\n");
                                                    newSim.save()
                                                }
                                            })

                                    }).catch((err) => {
                                        console.log("1-2 error");
                                    })
                            }

                        })
                }
            }

            result1(data);
            result2(data);
            resolve();
        })

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




//------------------------------------------------------------

// 자세한투표결과 클릭시 유사도계산하고 정렬해서 데이터넘겨주는 함수

module.exports.simResult = function (pollData, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData }).exec().then((data) => {

            const result1 = async (data) => {
                for (const user of data.option1HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;

                            userA = user;
                            userB = curUser.userName;

                            Similarity.findOne({ user1: userA, user2: userB })
                                .then((simData1) => {
                                    check1 = simData1;
                                    Similarity.findOne({ user1: userB, user2: userA })
                                        .then((simData2) => {
                                            check2 = simData2;
                                            if (check1) {
                                                simData = check1;
                                            } else if (check2) {
                                                simData = check2;
                                            } else {
                                                simData = null;
                                            }

                                            if (simData) {

                                                if (boardNum == 1) {
                                                    var total = simData.same1 + simData.diff1;
                                                    var result = (simData.same1 / total) * 100;
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim1: result } }
                                                    ).exec()

                                                } else if (boardNum == 2) {
                                                    var total = simData.same2 + simData.diff2;
                                                    var result = (simData.same2 / total) * 100;
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim2: result } }
                                                    ).exec()
                                                } else if (boardNum == 3) {
                                                    var total = simData.same3 + simData.diff3;
                                                    var result = (simData.same3 / total) * 100;
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim3: result } }
                                                    ).exec()

                                                } else if (boardNum == 4) {
                                                    var total = simData.same4 + simData.diff4;
                                                    var result = (simData.same4 / total) * 100;
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim4: result } }
                                                    ).exec()
                                                }
                                            }
                                        })
                                }).catch((err) => {
                                    console.log(err);
                                    reject();
                                })
                        })
                }
            }

            const result2 = async (data) => {
                for (const user of data.option2HasVoted) {
                    await delay()
                        .then(() => {
                            var boardNum = data.board;
                            var check1, check2, simData, userA, userB;

                            userA = user;
                            userB = curUser.userName;

                            Similarity.findOne({ user1: userA, user2: userB })
                                .then((simData1) => {
                                    check1 = simData1;
                                    Similarity.findOne({ user1: userB, user2: userA })
                                        .then((simData2) => {
                                            check2 = simData2;
                                            if (check1) {
                                                simData = check1;
                                            } else if (check2) {
                                                simData = check2;
                                            } else {
                                                simData = null;
                                            }

                                            if (simData) {

                                                if (boardNum == 1) {
                                                    var total = simData.same1 + simData.diff1;
                                                    var result = (simData.same1 == 0) ? 0 : ((simData.same1 / total) * 100);
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim1: result } }
                                                    ).exec()

                                                } else if (boardNum == 2) {
                                                    var total = simData.same2 + simData.diff2;
                                                    var result = (simData.same2 == 0) ? 0 : ((simData.same2 / total) * 100);
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim2: result } }
                                                    ).exec()
                                                } else if (boardNum == 3) {
                                                    var total = simData.same3 + simData.diff3;
                                                    var result = (simData.same3 == 0) ? 0 : ((simData.same3 / total) * 100);
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim3: result } }
                                                    ).exec()

                                                } else if (boardNum == 4) {
                                                    var total = simData.same4 + simData.diff4;
                                                    var result = (simData.same4 == 0) ? 0 : ((simData.same4 / total) * 100);
                                                    Similarity.findOneAndUpdate(
                                                        { user1: simData.user1, user2: simData.user2 },
                                                        { $set: { sim4: result } }
                                                    ).exec()
                                                }
                                            }
                                        })
                                }).catch((err) => {
                                    console.log(err);
                                    reject();
                                })
                        })
                }
            }
            result1(data);
            result2(data);
        })
        resolve();
    });
}


module.exports.simSort = function (pollData, curUser) {
    return new Promise(function (resolve, reject) {
        Polls.findOne({ _id: pollData }).exec().then((data) => {
            Similarity.aggregate([
                {
                    $match: {
                        $or: [
                            { user1: curUser.userName },
                            { user2: curUser.userName }
                        ]
                    }
                },
                {
                    $project: {
                        user: {
                            $cond: {
                                if: { $eq: ["$user1", curUser.userName] }, then: "$user2", else: "$user1"
                            }
                        },
                        similarity: {
                            $round: [{
                                $cond: {
                                    if: { $eq: [data.board, 1] }, then: "$sim1", else: {
                                        $cond: {
                                            if: { $eq: [data.board, 2] }, then: "$sim2", else: {
                                                $cond: {
                                                    if: { $eq: [data.board, 3] }, then: "$sim3", else: "$sim4"
                                                }
                                            }
                                        }
                                    }
                                }
                            }, 2]
                        }
                    }
                },
                {
                    $sort: { similarity: -1 }
                }
            ]).then((simdata) => {
                resolve([data, simdata]);
            })
        })
    });
}
