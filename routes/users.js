const express = require('express');
const User = require('../models/User');

const router = express.Router(); // eslint-disable-line new-cap

/* GET users listing. */
router.get('/', (req, res) => res.send('respond with a resource'));

router.get('/:username', (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) {
        next(err);
      } else {
        res.render('users/profile', { user });
      }
    });
  }
});

module.exports = router;
