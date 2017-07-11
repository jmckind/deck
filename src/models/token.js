var thinky = require('../util/thinky.js');
var type   = thinky.type;
var r      = thinky.r;

var Token = thinky.createModel('Token', {
  userId: type.string(),
  created_date: type.date().required().default(r.now()),
  expiration_date: type.date().required()
});

module.exports = Token;
