var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

function isValidUsername(str) {
  var max = 32;

  str = String(str);

  if (str[0] === '-')
  
  
  var valid = /^[a-zA-Z0-9\-\_]+$/; // a-Z, 0-9, - and _
  var len = str.length;

  if (len <= 0) {
    return 1; // no string
  }

  if (len > max) {
    return 2; // too big string
  }

  if (str.match(valid)) {
    return 0; // valid string
  }

  return 3; // does not match regex
}

module.exports = function (passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Log in strategy
  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // req
    },
    function (req, username, password, done) {
      User.findOne({ 'username': username }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('account-message', 'Incorrect username.'));
        }

        if (!user.validPassword(password)) {
          return done(null, false, req.flash('account-message', 'Incorrect password.'));
        }

        console.log('user :: ' + username + ' logged in!');

        return done(null, user);
      });
    }
  ));

  // Sing up strategy
  passport.use('local-join', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      process.nextTick(function () { // asynchronous
        var email = req.body.email;

        User.findOne({ 'username':  username }, function (err, user) { // wont fire unless data is sent back
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, false, req.flash('account-message', 'Username is already taken.'));
          }

          User.findOne( { 'email': email }, function (err, user) {
            if (err) {
              return done(err);
            }

            if (user) {
              return done(null, false, req.flash('account-message', 'Email is already taken.'));
            }

            var newUser = new User();
            newUser.username = username;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err) {
                throw err;
              }

              console.log('new_user :: ' + username + ' signed up!');

              return done(null, newUser);
            });
          });
        });
      });
    }
  ));

};
