/* jshint node: true */

var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET Sign in page
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Sing in to Chat',
    message: req.flash('signin-message')
  });
});

// GET Password reset page
router.get('/password_reset', function (req, res, next) {
  // TODO: Make it work
  req.flash('signin-message', 'Can\'t password reset yet!');
  res.redirect('/login');
});

module.exports = router;
