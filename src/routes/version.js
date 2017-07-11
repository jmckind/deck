var middleware = require('../middleware/index.js');
var router     = require('express').Router();

var controller = {
  get: function(req, res) {
    res.json({ version: '1.0.0' });
  }
};

router.get('/', middleware.auth.auth_required, controller.get);

module.exports = router;
