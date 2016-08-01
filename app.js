var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var socketio = require('socket.io');

require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const MONGO_PASS = process.env.MONGO_DB_PASS;
const MONGO_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST;
const MONGO_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT;

var mongoose = require('mongoose');
if (MONGO_HOST) {
  mongoose.connect('mongodb://admin:' + MONGO_PASS + '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + DB_NAME);
} else {
  mongoose.connect('mongodb://localhost/' + DB_NAME);
}

var routes = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');

var app = express();
app.io = io = socketio();

io.on('connection', function(socket){
  console.log('Someone connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

app.use(session({
  secret: 'my secret session phrase that needs to be changed',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user;
  next();
});

var User = require('./models/User');
passport.use(new LocalStrategy(function(username, password, cb) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return cb(err);
    if (!user) return cb(null, false);
    console.log(user.password, password);

    if (user.password != password) return cb(null, false);
    return cb(null, user);
  });
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
}, function(accessToken, refreshToken, profile, cb) {
    User.findOne({ facebookId: profile.id }, function (err, user) {
      if (err) cb(err);
      if (user) return cb(err, user);

      user = new User({
        facebookId: profile.id,
        profile: profile
      });

      user.save(function(err){
        if (err) return cb(err);
        cb(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  User.findOne(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, './public')));

app.use('/', routes);
app.use('/courses', courses);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
