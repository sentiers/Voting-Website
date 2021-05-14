var util = {};

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } 
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/login');
  }
} // 로그인 되었는지 안되었는지 판단

util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
} // 접근권한이 있는지 판단

module.exports = util; // 로그인 하는거라고해서 일단 긁어봤어여 ㅋ
//이걸로는 안되고 추가 해야되는데 도움이 필요....ㅎ..