var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/time.json', function(req, res, next){
  res.send({ now: Date.now() });
});

router.post('/message', function(req, res, next){
  if (req.body.message){
  	return res.send({ status: 'success', message: 'Message (' + req.body.message + ') received' });
  } else {
  	return res.send({ status: 'error', message: 'Please provide message.' });
  }
});

router.get('/jsonp', function(req, res, next){
  res.send(req.query.callback + '(' + JSON.stringify({ hello: "World!" }) + ')');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/users/' + req.user.username);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res){
  res.redirect('/');
});

module.exports = router;
