var config     = require('../util/settings.js');
var middleware = require('../middleware/index.js');
var models     = require('../models/index.js');
var thinky    = require('../util/thinky.js');
var r         = thinky.r;
var router    = require('express').Router();
var bcrypt    = require('bcryptjs');
var Token     = models.Token;
var User      = models.User;

var controller = {
  list: function(req, res) {
    Token.run().then(function(result) {
      res.json({ tokens: result });
    }).error(models.handleError(res));
  },
  create: function(req, res) {
    var credentials = req.body;
    if (!credentials.hasOwnProperty('username') || credentials.username.length <= 0) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    if (!credentials.hasOwnProperty('password') || credentials.password.length <= 0) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    User.filter(r.row('username').eq(credentials.username)).getJoin({token: true}).run().then(function(users) {
      if (users.length <= 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      } else if (users.length > 1) {
        console.log('More than 1 User for username: ' + credentials.username);
        return res.status(410).json({ error: 'There is a problem with the account specified, please contact support.' }); // :)
      }

      var user = users[0];
      if (!bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (user.token) {
        var current_date = new Date();
        if (current_date >= user.token.expiration_date) {
          console.log('Token expired, refreshing...');
          user.token.expiration_date = r.now().add(config.deck.token_validity);

          user.token.save().then(function(result) {
            return res.status(201).json({ token: result });
          }).error(models.handleError(res));
        } else {
          return res.json({ token: user.token });
        }
      } else {
        var token = new Token({
          userId: user.id,
          expiration_date: r.now().add(config.deck.token_validity)}
        );

        token.save().then(function(result) {
          return res.status(201).json({ token: result });
        }).error(models.handleError(res));
      }
    }).error(models.handleError(res));
  },
  get: function(req, res) {
    Token.get(req.params.id).getJoin({user: true}).run().then(function(result) {
      res.json({ token: result });
    }).error(models.handleError(res));
  },
  delete: function(req, res) {
    Token.get(req.params.id).delete().execute().then(function(result) {
      return res.status(204).send('');
    }).error(models.handleError(res));
  },
};

router.route('/')
  .get(middleware.auth.admin_required, controller.list)
  .post(controller.create);

router.route('/:id')
  .get(middleware.auth.admin_required, controller.get)
  .delete(middleware.auth.admin_required, controller.delete);

module.exports = router
