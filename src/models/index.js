var resource = require('./resource.js');
var role = require('./role.js');
var token = require('./token.js');
var user = require('./user.js');

var handleError = function(res) {
  return function(error) {
    if (error.hasOwnProperty('name')) {
      if (error.name === 'DocumentNotFoundError') {
        return res.status(404).send('');
      } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error(error.stack);
    return res.status(500).json({ error: 'Unexpected Error' });
  }
}

module.exports = {
  handleError: handleError,
  Resource: resource.Resource,
  ResourceCategory: resource.ResourceCategory,
  Role: role,
  Token: token,
  User: user
};
