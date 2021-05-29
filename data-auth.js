const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dbUser:voting2021@votingweb.wwp3p.mongodb.net/votingDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

///////////////////////////////////////////////////

var User = require('./src/User.js');

///////////////////////////////////////////////////


// 회원가입하고 비밀번호암호화하는 함수
module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {
            let newUser = new User(userData);
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {
                        newUser.password = hash;
                        newUser.save((err) => {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("User Name already taken");
                                } else {
                                    reject("There was an error creating the user: " + err);
                                }
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            });
        }
    });
};


// 로그인할때 사용자의 아이디와 비밀번호가 매칭하는지 확인하는 함수
module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName })
            .exec()
            .then((user) => {
                if (user.length == 0) {
                    reject("Unable to find user: " + userData.userName);
                } else {
                    bcrypt.compare(userData.password, user[0].password)
                        .then((res) => {
                            if (res === false) {
                                reject("Incorrect Password for user: " + userData.userName);
                            } else {
                                resolve(user[0]);
                            }
                        }).catch((err) => {
                            reject("There was an error when attempting to log in: " + err);
                        });
                }
            }).catch((err) => {
                reject("Unable to find user: " + userData.userName);
            });
    });
};

///////////////////////////////////////////////////