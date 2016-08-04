const express = require('express');

const router = express.Router();  // eslint-disable-line new-cap

const Course = require('../models/Course');

router.get('/', (req, res) => {
  Course.find((err, docs) => res.render('courses/index', { courses: docs }));
});

router.post('/', (req, res) => {
  const course = new Course({
    name: req.body.name,
  });
  course.save((err) => {
    if (err) res.send(`error ${err}`);
    else res.redirect('/courses');
  });
});

module.exports = router;
