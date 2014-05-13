//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

//route files to load
var index = require('./routes/index');

//database setup - uncomment to set up your database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://localhost/tritonCal');

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
app.get('/login', index.login);
app.get('/googleLogin', index.googleLogin);
app.get('/app', index.tritonCal);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
