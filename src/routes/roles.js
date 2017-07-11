var middleware = require('../middleware/index.js');
var models = require('../models/index.js');
var router = require('express').Router();
var Role = models.Role;

var controller = {
  list: function(req, res) {
    Role.orderBy({index: 'name'}).run().then(function(result) {
      res.json({ roles: result });
    }).error(models.handleError(res));
  },
  create: function(req, res) {
    new Role(req.body).save().then(function(result) {
      res.status(201).json({ role: result });
    }).error(models.handleError(res));
  },
  get: function(req, res) {
    Role.get(req.params.id).run().then(function(result) {
      res.json({ role: result });
    }).error(models.handleError(res));
  },
  update: function(req, res) {
    Role.get(req.params.id).run().then(function(role) {
      role.merge(req.body).save().then(function(result) {
        res.json({ role: result });
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  },
  delete: function(req, res) {
    Role.get(req.params.id).delete().execute().then(function(result) {
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
