/* jshint node: true */

var express = require('express');
var passport = require('passport');

var router = express.Router();

// Functions

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Route '/'

// GET Home page
router.get('/', function (req, res, next) {
  var user = '';
  if (typeof (req.user) !== 'undefined') {
    user = req.user.username;
  }

  res.render('index', { title: user });
});

// GET Sign in page
router.get('/login', isLoggedIn, function (req, res, next) {
  res.render('login', {
    title: 'Sing in to Chat',
    message: req.flash('account-message')
  });
});

// POST Sign in
router.post('/login', isLoggedIn, passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET Join page
router.get('/join', isLoggedIn, function (req, res, next) {
  res.render('join', {
    title: 'Join Chat',
    message: req.flash('account-message')
  });
});

// POST Sign in
router.post('/join', isLoggedIn, passport.authenticate('local-join', {
  successRedirect: '/',
  failureRedirect: '/join',
  failureFlash: true
}));

// GET Password reset page
router.get('/password_reset', function (req, res, next) {
  var user = '';
  var email = '';
  if (typeof (req.user) !== 'undefined') {
    user = req.user.username;
    email = req.user.email;
  }

  res.render('password_reset', {
    title: 'Reset your password',
    user: user,
    email: email,
    message: req.flash('reset-message')
  });
});

// POST Password reset
router.post('/password_reset', function (req, res, next) {
  var user = '';
  if (typeof (req.user) !== 'undefined') {
    user = req.user.username;
  }

  var email_field = req.body.email;

  // TODO: Make password reset work

  req.flash('reset-message', 'Can\'t password reset yet!');
  res.redirect('/password_reset');
});

module.exports = router;
