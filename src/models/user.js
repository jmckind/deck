var thinky = require('../util/thinky.js');
var type   = thinky.type;
var r      = thinky.r;
var Role   = require('./role.js');
var Token  = require('./token.js');

var User = thinky.createModel('User', {
  username: type.string().required().email(),
  password: type.string().required().min(8),
  first_name: type.string().required().min(1),
  last_name: type.string().required().min(2),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required().default(r.now()),
});

User.hasOne(Token, "token", "id", "userId");
User.hasAndBelongsToMany(Role, "roles", "id", "id")
Role.hasAndBelongsToMany(User, "users", "id", "id")
Token.belongsTo(User, "user", "userId", "id");

module.exports = User;
