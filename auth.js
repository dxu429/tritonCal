//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.googleapi_clientid, process.env.googleapi_clientsecret, process.env.redirect_uri);

var authUrl = oauth2Client.generateAuthUrl({
  access_type:  'offline', 
  scope:  'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
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
      exports.authUrl = authUrl;
    }
  });  
