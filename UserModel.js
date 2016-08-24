var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// schema for user register
var UserSchema = new mongoose.Schema({

  username: String,
  password: String

});

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);

  exp.setDate(today.getDate() + 60);

// the function we're invoking
  return jwt.sign({

    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

var User = mongoose.model('User', UserSchema);

module.exports = User;