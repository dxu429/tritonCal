var auth = require('../auth');

exports.view = function(req, res) {
	res.render('index');
}

exports.login = function(req, res) {
	if (!req.query.code) {
    if (!req.query.error) { 
      res.redirect(auth.authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  auth.client.getToken(req.query.code, function(err, tokens) {
    auth.client.credentials = tokens;
    getData();
  });

  var locals = {title: 'sample app', url:auth.authUrl};
  res.render('index', locals);
}
var getData = function() {
  auth.oauth.userinfo.get().withAuthClient(auth.client).execute(function(err, results){
      console.log(results);
  });
  auth.cal.calendarList.list().withAuthClient(auth.client).execute(function(err, results){
    console.log(results);
  });
};
exports.loggedin = function(req, res) {
}
