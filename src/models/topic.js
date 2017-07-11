var thinky = require('../util/thinky.js');
var type   = thinky.type;
var Errors = thinky.Errors;
var r      = thinky.r;

var Topic = thinky.createModel('Topic', {
  name: type.string().required().min(1),
  active: type.boolean().required().default(true),
  weight: type.number().integer().required().default(0),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required()
});

Topic.pre('save', function(next) {
  var obj = this;
  Topic.filter(r.row('name').eq(obj.name)).run().then(function(topics) {
    if (topics.length > 0) {
      next(new Errors.ValidationError("A Topic with that name already exists."));
    } else {
      obj.modified_date = r.now();
      next();
    }
  });
});

Topic.ensureIndex('name');

module.exports = Topic;
