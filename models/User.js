const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  facebookId: String,
  profile: Object,
});

module.exports = mongoose.model('User', UserSchema);
