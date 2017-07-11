var middleware = require('../middleware/index.js');
var router     = require('express').Router();
var meta       = require('../package.json');

var controller = {
  index: function(req, res) {
    res.json({ version: meta.version });
  }
};

router.get('/', middleware.auth.auth_required, controller.index);

module.exports = router;
