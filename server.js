
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");
//----------------------------------------------------
const dataServiceAuth = require("./data-auth.js");
const polls = require("./src/Polls.js");
//----------------------------------------------------
const HTTP_PORT = process.env.PORT || 8080;
//----------------------------------------------------
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//----------------------------------------------------

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

//----------------------------------------------------



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


///////////////// 투표 게시 관련 //////////////////////////
app.get("/create", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/create.html"));
});

app.post("/create", function (req, res) {
  polls.createPoll(req.body)
    .then(() => {
      res.redirect("/main");
    }).catch((err) => {
      res.redirect("/create");
    });
});



///////////////// 투표 참여, 결과 관련 //////////////////////////

app.get("/food/:id", ensureLogin, function (req, res) {
  res.sendFile(path.join(__dirname, "./views/vote.html"));

  // 음식 게시물에서 투표제목클릭하면 그 투표의 창이 뜨게하는것

});


// 연애

// 패션

//자유










///////////////         게시판       ////////////////
app.get("/food", ensureLogin, function (req, res) {
  polls.getAllFood().then((data) => {
    res.render('food', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

app.get("/relationship", ensureLogin, function (req, res) {
  polls.getAllRelationship().then((data) => {
    res.render('relationship', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

app.get("/fashion", ensureLogin, function (req, res) {
  polls.getAllFashion().then((data) => {
    res.render('fashion', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

app.get("/free", ensureLogin, function (req, res) {
  polls.getAllFree().then((data) => {
    res.render('free', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
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
  });
});

app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/register.html"));
});

app.post("/register", function (req, res) {
  dataServiceAuth.registerUser(req.body)
    .then(() => {
      res.redirect("/login");
    }).catch((err) => {
      res.redirect("/register");
    });
});

app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect("/");
});






///////////////// 프로필보기, 나의투표목록보기    ///////////////////

app.get("/profile", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/profile.html"));
});

app.get("/myvotelist", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/myvotelist.html"));


  //자신이 투표했던 것들만 뜨게해야함




});




///////////////////////////////////////////////////
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

app.listen(HTTP_PORT, function () {
  console.log("app listening on: " + HTTP_PORT)
});
