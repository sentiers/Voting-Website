
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
  res.locals.url = req.originalUrl; // ejs에서 url 필요해서 추가
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

app.use(clientSessions({
  cookieName: "session",
  secret: "votingWeb",
  duration: 2 * 60 * 60 * 1000, // 2시간 지속
  activeDuration: 1000 * 60 * 5 // active하면 이만큼 계속 연장
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
  polls.createPoll(req.body, req.session.user)
    .then(() => {
      res.redirect("/main");
    }).catch((err) => {
      res.redirect("/create");
    });
});



///////////////// 투표 참여, 결과 관련 //////////////////////////


// 옵션 increment --------------------

app.get("/update1/:id", ensureLogin, function (req, res) {
  polls.increOpt1(req.params.id, req.session.user).then((data) => {
    polls.similarityCal1(req.params.id, req.session.user)
    res.render('vote', { datas: data });
  }).catch((data) => {
    res.render('vote', { datas: data, error: "이미 투표에 참여하셨습니다!" });
  });
});

app.get("/update2/:id", ensureLogin, function (req, res) {
  polls.increOpt2(req.params.id, req.session.user).then((data) => {
    polls.similarityCal2(req.params.id, req.session.user)
    res.render('vote', { datas: data });
  }).catch((data) => {
    res.render('vote', { datas: data, error: "이미 투표에 참여하셨습니다!" });
  });
});


// 음식---------------------------------------------------------
app.get("/food/:id", ensureLogin, function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('vote', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

// 연애---------------------------------------------------------
app.get("/relationship/:id", ensureLogin, function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('vote', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

// 패션---------------------------------------------------------
app.get("/fashion/:id", ensureLogin, function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('vote', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

//자유---------------------------------------------------------
app.get("/free/:id", ensureLogin, function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('vote', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});


//결과---------------------------------------------------------
app.get("/result/:id", function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('result', { datas: data });
  }).then(polls.simResult(req.params.id, req.session.user))
  .catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

app.get("/similarity/:id", function (req, res) {
  polls.simSort(req.params.id, req.session.user)
    .then((data) => {
      console.log(data[1]);
      res.render('similarity', { datas: data[0], sims: data[1] });
    })
    .catch((err) => {
      res.sendFile(path.join(__dirname, "./views/404.html"));
    })
});

// ----------------------------------------------------------------


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
  dataServiceAuth.checkUser(req.body).then((user) => {
    req.session.user = {
      userName: user.userName,
      gender: user.gender,
      age: user.age
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
  res.render('profile', { datas: req.session.user });
});

app.get("/myvotelist", function (req, res) {
  polls.getPollsByUser(req.session.user).then((data) => {
    res.render('myvotelist', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});

// 나의 투표에서 게시글로 넘어가기
app.get("/myvotelist/:id", ensureLogin, function (req, res) {
  polls.getPollById(req.params.id).then((data) => {
    res.render('vote', { datas: data });
  }).catch((err) => {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  });
});


///////////////////////////////////////////////////
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

app.listen(HTTP_PORT, function () {
  console.log("app listening on: " + HTTP_PORT)
});