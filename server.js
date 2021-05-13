var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();
const { userRouter } = require('../src/userRoute') // lee
const mongoose = require('mongoose') // lee

//const MONGO_URI = '여기 몽고 DB'

function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static("./public/"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(HTTP_PORT, onHttpStart);

app.use('/user', userRouter); // 이거 강의에 들어가있는데 뭔지 잘 모르겠...