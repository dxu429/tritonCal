//load environment variables
var dotenv = require('dotenv');
dotenv.load();

//Set up facebook graph auth 
var fbgraph = require('fbgraph'),
    fbAuthUrl = fbgraph.getOauthUrl({
        "client_id":  process.env.facebook_clientid
      , "redirect_uri": process.env.fbredirect_uri 
      , "scope": "user_friends, user_about_me, user_birthday, read_stream, user_groups"
    }),
    fbAuthObj = function(req) {
      fbgraph.setAppSecret(process.env.facebook_clientsecret);
      return {
        "client_id":     process.env.facebook_clientid
      , "redirect_uri":  process.env.fbredirect_uri
      , "client_secret": process.env.facebook_clientsecret
      , "code": req.query.code
    }};

exports.fbgraph = fbgraph;
exports.fbAuthObj = fbAuthObj;
exports.fbAuthUrl = fbAuthUrl;

//Set up google api auth
var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2,
    oauth2Client = new OAuth2(process.env.googleapi_clientid, 
      process.env.googleapi_clientsecret, 
      process.env.googleredirect_uri
    ),
    googleAuthUrl = oauth2Client.generateAuthUrl({
      access_type:  'offline', 
      scope:  "https://www.googleapis.com/auth/calendar \
              https://www.googleapis.com/auth/userinfo.email \
              https://www.googleapis.com/auth/userinfo.profile"
    });

googleapis
  .discover('calendar', 'v3')
  .discover('oauth2', 'v2')
  .execute(function(err, clients) {
    if(!err) {
      console.log(clients);
      exports.cal = clients.calendar;
      exports.oauth = clients.oauth2;
      exports.client = oauth2Client;
      exports.googleAuthUrl = googleAuthUrl;
    }
  });  
