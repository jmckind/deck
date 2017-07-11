var thinky = require('../util/thinky.js');
var type   = thinky.type;
var Errors = thinky.Errors;
var r      = thinky.r;

var Role = thinky.createModel('Role', {
  name: type.string().required().min(2),
  description: type.string().required(),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required()
});

Role.pre('save', function(next) {
  var obj = this;
  Role.filter(r.row('name').eq(obj.name)).run().then(function(roles) {
    if (roles.length > 0) {
      next(new Errors.ValidationError("A Role with that name already exists."));
    } else {
      obj.modified_date = r.now();
      next();
    }
  });
});

Role.ensureIndex('name');

module.exports = Role;
