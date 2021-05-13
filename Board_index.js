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


/*
https://www.a-mean-blog.com/ko/blog/Node-JS-%EC%B2%AB%EA%B1%B8%EC%9D%8C/%EC%A3%BC%EC%86%8C%EB%A1%9D-%EB%A7%8C%EB%93%A4%EA%B8%B0/CRUD%EC%99%80-7-Standard-Actions
CRUD 설명
*/


/*
server.js 에 추가

app.use('/', require('./routes/Board_index'));
이 주소로 get 요청이 오면 콜백
*/

/*
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