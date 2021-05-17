const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");
//const fs = require("fs");
//const multer = require("multer");
//const exphbs = require("express-handlebars");

const dataServiceAuth = require("./data-auth.js");


const HTTP_PORT = process.env.PORT || 8080;

//const { userRouter } = require('../src/userRoute') // lee

///////////////////////////////////////////////////

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////////

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

app.use(clientSessions({
  cookieName: "session",
  secret: "votingWeb",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

////////////// 로그인 되어있나 체크 /////////////////

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

///////////////// 메인, 공지 페이지 //////////////////////////

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/main", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/main.html"));
});

app.get("/announcement", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/announcement.html"));
});

///////////////// 투표 게시 //////////////////////////

app.get("/create", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/create.html"));
});

app.post("/create", function (req, res) {
  Polls.somefunction(req.body) //함수이름 Polls에서 가져오기
    .then(() => {
      res.redirect.window.history.back(); //고쳐야할수도
    }).catch((err) => {
      res.redirect("/create");
    });
});

///////////////         게시판       /////////////////////////////

app.get("/food", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/food.html"));
});

app.get("/relationship", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/relationship.html"));
});

app.get("/fashion", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/fashion.html"));
});

app.get("/free", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/free.html"));
});


/////////////////    로그인, 레지스터    /////////////////////////////

app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/login.html"));
});

app.post("/login", function (req, res) {
  req.body.userAgent = req.get("User-Agent");
  dataServiceAuth.checkUser(req.body).then((user) => {
    req.session.user = {
      userName: user.userName,
      loginHistory: user.loginHistory
    }
    res.redirect("/main");
  }).catch((err) => {
    res.redirect("/login");
    //res.render("login", { errorMessage: err, userName: req.body.userName });
  });
});

app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/register.html"));
});

app.post("/register", function (req, res) {
  dataServiceAuth.registerUser(req.body)
    .then(() => {
      res.redirect("/login");
      //res.render("register", { successMessage: "User created successfully" });
    }).catch((err) => {
      res.redirect("/register");
      //res.render("register", { errorMessage: err, userName: req.body.userName });
    });
});

app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/");
});

///////////////////////////////////////////////////
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

app.listen(HTTP_PORT, function () {
  console.log("app listening on: " + HTTP_PORT)
});
