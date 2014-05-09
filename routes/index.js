var auth = require('../auth');

//Welcome page callback
exports.view = function(req, res) {
	res.render('index');
}

/**
 *  Callback for facebook login
 *  This is also the redirect uri for fb auth
 */
exports.login = function(req, res) {
	if (!req.query.code) {
    if (!req.query.error) { 
      res.redirect(auth.fbAuthUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  auth.fbgraph.authorize(
    auth.fbAuthObj(req)
  , function(err, facebookRes) {
      res.redirect('googleLogin');
  });
}

/**
 *  Callback for google login
 *  This is also the redirect uri for google auth
 */
exports.googleLogin = function(req, res) {
	if (!req.query.code) {
    if (!req.query.error) { 
      res.redirect(auth.googleAuthUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  auth.client.getToken(req.query.code, function(err, tokens) {
    auth.client.credentials = tokens;
    getData();
  });

  // Will consider redirecting to page after login
  var locals = {url:auth.googleAuthUrl};
  res.render('index', locals);
}

/** 
 *  Example of how to use googleapi 
 */
var getData = function() {
  auth.oauth.userinfo.get().withAuthClient(auth.client).execute(function(err, results){
      console.log(results);
  });
  auth.cal.calendarList.list().withAuthClient(auth.client).execute(function(err, results){
    console.log(results);
  });
};

exports.loggedin = function(req, res) {
  res.render('index');
}
