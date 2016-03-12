/* jshint node: true */

// Module dependencies
var express = require('express');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var util = require('util');
var http = require('http');
var path = require('path');

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');

// App
var app = express();

// All environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // view engine setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: true, secret: '_SeCrEt_' }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);
app.use('/users', users);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err // will print stacktrace
    });
  });
}

// Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {} // no stacktraces leaked to user
  });
});

module.exports = app;
