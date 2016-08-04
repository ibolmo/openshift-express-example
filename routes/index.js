const express = require('express');
const passport = require('passport');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => res.render('index', { title: 'Express' }));

router.get('/time.json', (req, res) => res.send({ now: Date.now() }));

router.post('/message', (req, res) => {
  if (req.body.message) {
    return res.send({
      status: 'success',
      message: `Message (${req.body.message}) received`,
    });
  }
  return res.send({ status: 'error', message: 'Please provide message.' });
});

router.get('/jsonp', (req, res) => {
  const json = JSON.stringify({ hello: 'World!' });
  res.send(`${req.query.callback}(${json})`);
});

router.get('/login', (req, res) => res.render('login', { title: 'Login' }));

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect(`/users/${req.user.username}`);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/'));

module.exports = router;
