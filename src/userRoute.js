const { Router } = require('express');
const userRouter = Router();
const mongoose = require('mongoose');
const { User } = require('./User');

userRouter.post('/register', async(req,res) => {
    try{
        let { username, userID, age, gender, password } = req.body;
        if(!username) return res.status(400).send({ err: "username is required"});
        if(!userID) return res.status(400).send({ err: "userID is required"});
        if(!age) return res.status(400).send({ err: "age is required"});
        if(!gender) return res.status(400).send({ err: "gender is required"});
        if(!password) return res.status(400).send({ err: "password is required"});

        const user = new User(req.body);
        await user.save();
        return res.send({ user})

    }catch(err){
        console.log(err); // 이거 필요한가..?
        return res.status(500).send({err: err.message})
    }
})// 의도 회원가입이랄까..?

userRouter.post('/login', async(req,res) => {
    try{
        if(userID !== i_userid) return res.status(400).send({ err: "Wrong userID"}) // i_userid는 입력한 아이디인데.. 그게 어떻게..해야할지...ㅎ
        if(password !== i_password) return res.status(400).send({ err: "Wrong password"})
    }catch(err){
        return res.status(500).send({err: err.message})
    }
}) //의도 로그인이랄까..? 하지만 모르겠다..


// 유저가 작성한 투표 보는 get (((User에 맞춰서 수정필요)))
router.get('/Polls', 
  function(req, res, next){
    if(req.User){
      getpolldata(req.User.userID, req, res, next);
    }

    else{
      res.redirect('/401');
      res.end();
      return;
    }
  }, 
  function(req, res, next){
    res.jsonp({Polls:res.locals.result});
  }
);
