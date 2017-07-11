var models = require('../models/index.js');
var Token  = models.Token;

function auth_token(req, res, next) {
  req.token = undefined;
  req.user = undefined;

  var token_header = req.get('X-Auth-Token');
  if (token_header === undefined || token_header.length <= 0) {
    return next();
  }

  Token.get(token_header).getJoin().run().then(function(token) {
    if (new Date() < token.expiration_date) {
      req.token = token;
      req.user = token.user;
    }
    next();
  }).error(function(error) {
    console.error(error.message);
    next();
  });
}

module.exports = auth_token;
