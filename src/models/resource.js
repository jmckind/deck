var thinky = require('../util/thinky.js');
var type   = thinky.type;
var Errors = thinky.Errors;
var r      = thinky.r;
var Topic  = require('./topic.js');

var Resource = thinky.createModel('Resource', {
  name: type.string().required().min(1),
  type: type.string().required().enum('Link', 'Markdown', 'Plain Text'),
  content: type.string().required(),
  active: type.boolean().required().default(true),
  weight: type.number().integer().required().default(0),
  topicId: type.string().optional(),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required()
});

Resource.pre('save', function(next) {
  var obj = this;
  Resource.filter(r.row('name').eq(obj.name)).run().then(function(resources) {
    if (resources.length > 0) {
      next(new Errors.ValidationError("A Resource with that name already exists."));
    } else {
      obj.modified_date = r.now();
      next();
    }
  });
});

Resource.ensureIndex('name');
Resource.belongsTo(Topic, "topic", "topicId", "id")

module.exports = Resource;
