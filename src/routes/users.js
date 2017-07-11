var middleware = require('../middleware/index.js');
var models     = require('../models/index.js');
var router     = require('express').Router();
var thinky     = require('../util/thinky.js');
var bcrypt     = require('bcryptjs');
var r          = thinky.r;
var Role       = models.Role;
var User       = models.User;

var controller = {
  list: function(req, res) {
    User.orderBy({index: 'username'}).run().then(function(result) {
      res.json({ users: result });
    }).error(models.handleError(res));
  },
  create: function(req, res) {
    var user = new User(req.body);
    user.password = bcrypt.hashSync(user.password);

    Role.filter(r.row('name').eq('user')).run().then(function(roles) {
      user.roles = roles; // There should only be one!
      user.saveAll().then(function(result) {
        res.status(201).json({ user: result });
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  },
  get: function(req, res) {
    User.get(req.params.id).getJoin().run().then(function(result) {
      res.json({ user: result });
    }).error(models.handleError(res));
  },
  update: function(req, res) {
    var data = req.body;
    User.get(req.params.id).run().then(function(user) {
      if (data.password && data.password.length > 0) {
        data.password = bcrypt.hashSync(data.password); // Hash password
      }

      user.merge(data).save().then(function(result) {
        res.json({ user: result });
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  },
  delete: function(req, res) {
    User.get(req.params.id).delete().execute().then(function(result) {
      return res.status(204).send('');
    }).error(models.handleError(res));
  },
  getRoles: function(req, res) {
    User.get(req.params.id).getJoin({roles: true}).run().then(function(user) {
      res.json({ roles: user.roles });
    }).error(models.handleError(res));
  },
  updateRoles: function(req, res) {
    User.get(req.params.id).getJoin({roles: true}).run().then(function(user) {
      Role.getAll(r.args(req.body.roles)).run().then(function(roles) {
        user.roles = roles;
        user.saveAll({roles: true}).then(function(result) {
          res.json({ user: result });
        }).error(models.handleError(res));
      }).error(models.handleError(res));
    }).error(models.handleError(res));
  }
};

router.route('/')
  .get(middleware.auth.admin_required, controller.list)
  .post(middleware.auth.admin_required, controller.create);

router.route('/:id')
  .get(middleware.auth.admin_required, controller.get)
  .put(middleware.auth.admin_required, controller.update)
  .delete(middleware.auth.admin_required, controller.delete);

router.route('/:id/roles')
  .get(middleware.auth.admin_required, controller.getRoles)
  .post(middleware.auth.admin_required, controller.updateRoles);

module.exports = router
