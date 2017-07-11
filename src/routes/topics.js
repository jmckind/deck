var middleware = require('../middleware/index.js');
var models = require('../models/index.js');
var router = require('express').Router();
var Topic = models.Topic;

var controller = {
  list: function(req, res) {
    Topic.orderBy('weight', 'name').run().then(function(result) {
      res.json({ topics: result });
    }).error(models.handleError(res));
  },
  create: function(req, res) {
    new Topic(req.body).save().then(function(result) {
      res.status(201).json({ topic: result });
    }).error(models.handleError(res));
  },
  get: function(req, res) {
    Topic.get(req.params.id).run().then(function(result) {
      res.json({ topic: result });
    }).error(models.handleError(res));
  },
  update: function(req, res) {
    Topic.get(req.params.id).run().then(function(topic) {
      topic.merge(req.body).save().then(function(result) {
        res.json({ topic: result });
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  },
  delete: function(req, res) {
    Topic.get(req.params.id).delete().execute().then(function(result) {
      return res.status(204).send('');
    }).error(models.handleError(res));
  },
};

router.route('/')
  .get(middleware.auth.admin_required, controller.list)
  .post(middleware.auth.admin_required, controller.create);

router.route('/:id')
  .get(middleware.auth.admin_required, controller.get)
  .put(middleware.auth.admin_required, controller.update)
  .delete(middleware.auth.admin_required, controller.delete);

module.exports = router
