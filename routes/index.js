var auth = require('../auth');
var models = require('../models');

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
    if (!req.query.error) { res.redirect(auth.fbAuthUrl); } 
    else { res.send('access denied'); }
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
    if (!req.query.error) { res.redirect(auth.googleAuthUrl); } 
    else { res.send('access denied'); }
    return;
  }

  auth.client.getToken(req.query.code, function(err, tokens) {
    auth.client.credentials = tokens;
    //getData();
  });

  res.redirect('app');
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

exports.tritonCal= function(req, res) {
  auth.fbgraph.get('/me', function(err, me){
    if(err) { console.log(err) };

    req.session.user_id = me.id;

    auth.fbgraph.get('/me/groups', function(err, groups) {
      if(err) { console.log(err) };

      models.User.find({id: me.id}).exec(function(dberr, user) {
        if(dberr) { console.log(dberr) };

        if(!user.length) {
          var newUser = models.User({
            id: me.id,
            first_name: me.first_name,
            email: me.email
          });
          newUser.save(addCallback);
          
          function addCallback(err) {
            if(err) { console.log(err); res.send(500); }
            res.render('app', {groups: groups.data});
          }
        } else {
          var fbgroups = groups.data;
          models.UserGroups.find({user_id: me.id}, 'group_id').exec(afterQuery);

          function afterQuery(dberr, usrGrps) { 
            if(dberr) { console.log(dberr); }

            if(!usrGrps.length) {
              res.render('app', {groups: groups.data});
            } else {
              function grpNotInCal(element) {
                return !(element.id in usrGrps);
              }

              res.render('app', { fbGroups: groups.data.filter(grpNotInCal),
                                  tritonCalGroups: usrGrps});
            }
          }
        }
      });
    });
    
  });
}

exports.addGroupToApp = function(req, res) {
  if( !req.session.user_id ) { res.redirect('login'); }
  if( !req.query.group_id)   { res.redirect('login'); }
  


  res.send(200);
}
