
var router = require('express').Router();
var Polls  = require('../Polls');
var User   = require('../User');

//
// == FUNCTION ==
// 

function getpolldata(userid, req, res, next){
  var searchfor = {};
  if(userid) searchfor.creator = userid;

  Polls.find(searchfor, function(err, pollarr){
    if(err) {
      res.redirect('/')
    }

    else{
      res.locals.result = pollarr;
      next();
    }
  });
}

// GET POLL BY postNum
function getpollbypostNum(id, req, res, next){
  Polls.find({_id: id}, function(err, poll){
    if(err) {
      res.redirect('/404');
    }
    else{
      res.locals.poll = poll;
      next();
    }
  })
}

// ***********************************************************************
// ***************************  ROUTE PART  ******************************
// ***********************************************************************

//
// == 에러 페이지 ==
//

// == 404 PAGE NOT FOUND ==
router.get('/404', // 링크에 domain/404 들어오면 404 에러 발생
  function(req, res, next){
    res.status('404');
    res.end('The page you are looking for does not exist');
  });

// == 500 INTERNAL SERVER ERROR ==
router.get('/500', // 링크에 domain/500 들어오면 500 에러 발생
  function(req, res, next){
    res.status('500');
    res.end('Internal server error');
});

// == 401 UNAUTHORIZED ACCESS ==
router.get('/401', // 링크에 domain/401 들어오면 401 에러 발생
  function(req, res, next){
    res.status('401').end('Unauthorized access');
  })

// ***********************************************************************

// 페이지에서 투표 목록 보기
router.get('/Polls/all', 
// domain -> /Polls/all 주소에 function 동작하도록 요청
// all을 카테고리 명칭마다 연결되게 바꾸기 food love fashion free 🥕당근
  function(req, res, next){
    getpolldata(null, req, res, next);
  }, 
  function(req, res, next){
    res.jsonp({Polls: res.locals.result}); // json 형태로 응답
  });

//====GET ONE POLL --- SINGLE PAGE=========================================
router.get('/Polls/getone/:postNum',
  function(req, res, next){
    if(req.params.postNum){
      getpollbypostNum(req.params.postNum, req, res, next);
    }

    else { 
      res.end();
    }
  },

  function(req, res, next){
    res.jsonp({poll: res.locals.poll});
  }
);

// == POST ==
// ==ADD A NEW POLL ==

router.post('/Polls/add', function(req, res, next){
  if(req.User){
    var 
      newPoll  = new Polls(),
      options  = [],
      title = +req.body.title;



    for(var i = 0; i< req.body.addoption.length; i++){

      if(req.body.addoption[i].length>0){
        options.push({
          optionName: req.body.addoption[i],
          votes: 0 
        })
      }
    }

    if(req.body.addoption[voteName-1] && req.body.addoption[(+voteName)-1].length>0){
      options[(+voteName)-1].votes = 1;
    }

    newPoll.title     = req.body.pollname;
    newPoll.options   = options;
    newPoll.author    = req.User.userName;
    newPoll.isClosed  = 0;
    newPoll.postDate  = Date.now();
    newPoll.chartType = req.body.chartName; // 결과창 차트 연결?
    newPoll.save(function(err){

      if(err) {
        console.log(err);
        res.redirect('/500');
      } // 에러나면 500에러

      else{
        addpolltoUser(newPoll._id, req, res, next);
      }
    });
  } 

  else{
    res.redirect('/401');
  } 
});



// == ADD VOTE FOR A POLL ==
router.post('/Polls/vote/:postNum', function(req, res, next){
  if(req.body.vote && req.params.postNum){

    //====ADD AN OPTION AND VOTE FOR IT=================================

    if(req.body.vote=="add"){
      if(req.body.addoption.length>0){

        // postNum으로 올려진 투표 탐색
        Polls.findOne({_id: req.params.postNum}, function(err, found){          
          if(err) {
            console.log(err);
            res.redirect('/404');
          }

          // == 옵션 추가 == -> 165줄부터 199줄까지 넣을지 말지 결정 X 🥕당근
         
          found.addOption(req.body.addoption, res);
          
          // 이미 추가된 옵션인지 확인
          if(res.locals.added==="no") {
            res.redirect('/single?postNum='+req.params.postNum);
          }

          else {
            found.save(function(err){
              if(err) {
                console.log(err);
                res.redirect('/500');
              }

              else{
                if(req.User){
                  addpolltoUser(req.params.postNum, req, res, next);
                }

                else{
                  res.redirect('/401');
                }
              }
            });
          }
        });
      }

      else{
        res.redirect('/single?postNum='+req.params.postNum);
      }
    }

    // 이미 있는 옵션에 투표
    else {
      // postNum으로 글 찾아서 투표
      Polls.findOne({_id: req.params.postNum}, function(err, found){
        if(err) {
          console.log(err);
          res.redirect('/500');
        }

        found.updateVotes(+req.body.vote); // Polls.js 스키마 참고
        found.save(function(err){
          if(err) throw err;
          if(req.User){
            addpolltoUser(req.params.postNum, req, res, next);
          }

          else{
            addPollsoffline(req.params.postNum, req, res, next);
          }
        });
      });
    }
  }

  else{
    res.redirect('/500');
  }
});

// == 투표 삭제 == 이것도 넣을지 말지.. 🥕당근

router.post('/Polls/delete/:postNum', function(req, res, next){
  if(req.User){
    if(req.params.postNum.length>0){
      Polls.findOne({_id: req.params.postNum}, function(err, found){
        if(err){
          console.log(err);
          res.redirect('/User');
        }

        if(found.creator == req.User.id){
          found.remove(function(error){
            if(error){
              console.log(error);
              res.redirect('/500');
            }

            else{
              res.redirect('/User');
            }
          });
        }

        else{
          res.redirect('/User');
        }
      });
    }

    else {
      res.redirect('/404');
    }
  }

  else{
    res.redirect('/401');
  }
});

module.exports= router;



/*
이전 코드

var express = require('express');
const { isBuffer } = require('util');
var router = express.Router();
var Board = require('./Board');

// Index
router.get('/', function(req, res) {
    Board.find({})
    .sort ('-postDate') // 발행 시간에 따라 정렬
    .exec (function(err, Board_index) {
        if(err) return res.json(err);
        res.render('Board_index/index', {Board_index:Board_index});
    });
});

// https://www.zerocho.com/category/MongoDB/post/59a66f8372262500184b5363
// 참조 관계 내용

// New 콜백 함수
router.get ('/new', function(req, res) {
    res.render('Board_index/new');
});

// Create 콜백 함수
router.post ('/', function(req, res) {
    Board.create(req, voteQuestion, function(err, post) {
        if(err) return res.json(err);
    });
});

// Show 콜백 함수
router.get ('/:id', function (req, res) {
    Board.findOne({_id:req.params.id}, function(err, post) {
        res.render('Board_index/show', {post:Board});
    });
});

// Edit 콜백 함수
router.get ('/:id/edit', function (req, res) {
    Board.findOne({_id:req.params.id}, function(err, post) {
        if(err) return res.json(err);
        res.render('Board_index/edit', {post:Board});
    });
});

// Delete 콜백 함수
router.delete ('/:id', function(req, res) {
    Board.deleteOne({_id:req.params.id}, function(err) {
        if(err) return res.json(err);
        res.redirect('/Board_index');
    });
});

module.exports = router; // 모듈 생성

https://www.a-mean-blog.com/ko/blog/Node-JS-%EC%B2%AB%EA%B1%B8%EC%9D%8C/%EC%A3%BC%EC%86%8C%EB%A1%9D-%EB%A7%8C%EB%93%A4%EA%B8%B0/CRUD%EC%99%80-7-Standard-Actions
CRUD 설명

server.js 에 추가

app.use('/', require('./routes/Board_index'));
이 주소로 get 요청이 오면 콜백

req 객체는 클라이언트의 request
res 객체는 서버가 클라이언트에게 response
-> res.render ('index') = index를 페이지에 호출

req 객체
req.body : POST 정보를 가집니다. 파싱을 위해서 body-parser와 같은 패키지가 필요합니다. 요청 정보가 url에 들어있는 것이 아니라 Request의 본문에 들어있기 때문입니다. 
req.query : GET 정보를 가집니다. 즉, url로 전송된 쿼리 스트링 파라미터를 담고 있습니다.
req.params : 내가 이름 붙인 라우트 파라미터 정보를 가집니다.
req.headers : HTTP의 Header 정보를 가집니다.
*외에도 req.route, req.cookies, req.acceptedLanguages, req.url, req.protocol, req.host, req.ip 등이 존재합니다. 

res 객체
res.send : 다양한 유형의 응답을 전송합니다.
res.redirect : 브라우저를 리다이렉트 합니다. 
res.render : 설정된 템플릿 엔진을 사용해서 views를 렌더링합니다.
res.json : JSON 응답을 전송합니다.
res.end : 응답 프로세스를 종료합니다.
*외에도 res.set, res.status, res.type, res.sendFile, res.links, res.cookie 등이 존재합니다. 
*/