var middleware = require('../middleware/index.js');
var models     = require('../models/index.js');
var router     = require('express').Router();
var thinky     = require('../util/thinky.js');
var r          = thinky.r;
var Resource   = models.Resource;

var controller = {
  list: function(req, res) {
    var rdb = Resource.getJoin().orderBy('weight', 'name');
    if (req.query.hasOwnProperty('active') && req.query.active !== "false" && req.query.active !== "0") {
      rdb = rdb.filter(r.row('active').eq(true));
    }
    if (req.query.hasOwnProperty('type')) {
      rdb = rdb.filter(r.row('type').eq(req.query.type));
    }
    rdb.run().then(function(result) {
      res.json({ resources: result });
    }).error(models.handleError(res));
  },
  create: function(req, res) {
    new Resource(req.body).save().then(function(result) {
      res.status(201).json({ resource: result });
    }).error(models.handleError(res));
  },
  get: function(req, res) {
    Resource.get(req.params.id).getJoin().run().then(function(result) {
      res.json({ resource: result });
    }).error(models.handleError(res));
  },
  update: function(req, res) {
    Resource.get(req.params.id).run().then(function(resource) {
      resource.merge(req.body).save().then(function(result) {
        res.json({ resource: result });
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  },
  delete: function(req, res) {
    Resource.get(req.params.id).delete().execute().then(function(result) {
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
