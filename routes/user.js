/* jshint node: true */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Not Found');
});

module.exports = router;
