var express = require('express');
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// decrypt our JWT signatures with our secret to see if they're valid or not
var expressJWT = require('express-jwt');

var User = require('./UserModel');
console.log("from the server");

var auth = expressJWT({secret: 'SECRET'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());


mongoose.connect('mongodb://localhost/passportjwt');

// no need for sessions here
var LocalStrategy = require('passport-local').Strategy;

passport.use('login', new LocalStrategy(function(username, password, done) {

    User.findOne({ username: username }, function (err, user) {

      if (err) { return done(err); }

      if (!user) {

        return done(null, false, { message: 'Incorrect username.' });
      }
      console.log("user login success");
      return done(null, user);
    });
  }
));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// register route
app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/register.html');
});


app.get('/hello', auth, function (req, res) {
  res.json(req.user);
});

// login route
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

// post user register route
app.post('/register', function(req, res){

  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function (err){
    if(err){ return next(err); }
    console.log("new user");
    return res.json({token: user.generateJWT()});
  });
});

// post user login route
app.post('/login', function(req, res, next){

  passport.authenticate('login', function(err, user){

    if(err){ return next(err); }

    if (user) {
      console.log("user login success");
      return res.json({token: user.generateJWT()});

    } else {

      return res.status(401);
    }
  })(req, res, next);
});


app.listen(8000);




