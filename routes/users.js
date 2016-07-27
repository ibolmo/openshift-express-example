var express = require('express');
var router = express.Router();
var passport = require('passport')

var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', function(req, res, next) {
  if (!req.user) return res.redirect('/login');

  User.findOne({ username: req.params.username }, function(err, user){
    if (err) return next(err);
    res.render('users/profile', { user: user });
  });
});

module.exports = router;
