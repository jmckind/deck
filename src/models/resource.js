var thinky = require('../util/thinky.js');
var type   = thinky.type;
var r      = thinky.r;

var Resource = thinky.createModel('Resource', {
  name: type.string().required().min(1),
  type: type.string().required().enum('Link', 'Markdown', 'Plain Text'),
  content: type.string().required(),
  active: type.boolean().required().default(true),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required().default(r.now()),
});

var ResourceCategory = thinky.createModel('ResourceCategory', {
  name: type.string().required().min(2),
  description: type.string().required()
});

module.exports = {
  Resource: Resource,
  ResourceCategory: ResourceCategory
};
