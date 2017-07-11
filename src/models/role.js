var thinky = require('../util/thinky.js');
var type   = thinky.type;
var r      = thinky.r;

var Role = thinky.createModel('Role', {
  name: type.string().required().min(2),
  description: type.string().required()
});

module.exports = Role;
