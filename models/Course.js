const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  students: [{
    name: String,
    email: String,
  }],
  classes: [{
    name: String,
    taught: Date,
    teacher: {
      name: String,
      email: String,
    },
  }],
});

module.exports = mongoose.model('Course', CourseSchema);
