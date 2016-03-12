/* jshint node: true */

// Module dependencies
var express         = require('express');
var flash           = require('connect-flash');
var passport        = require('passport');
var mongoose        = require('mongoose');
var errorHandler    = require('errorhandler');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var debug           = require('debug')('chat:server');
var util            = require('util');
var http            = require('http');
var path            = require('path');

// Routes
var routes = require('./routes/index');
var routesUser = require('./routes/user');

// Variables
var testing = 'testing...';
console.log('| CHAT | ' + testing);

// Database connection
var config_database = require('./controllers/database');
var conn = mongoose.connect(config_database.url);

// App
var app = express();

// Socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// All environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // view engine setup

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: true, secret: '_SeCrEt_' }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', routes);
app.use('/user', routesUser);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err // will print stacktrace
    });
  });
}

// Production error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {} // no stacktraces leaked to user
  });
});

require('./config/passport')(passport);

module.exports = app;
