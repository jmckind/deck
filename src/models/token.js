var thinky = require('../util/thinky.js');
var type   = thinky.type;
var r      = thinky.r;

var Token = thinky.createModel('Token', {
  userId: type.string(),
  expiration_date: type.date().required(),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required()
});

Token.pre('save', function(next) {
  this.modified_date = r.now();
  next();
});

module.exports = Token;
