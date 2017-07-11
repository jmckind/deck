var router = require('express').Router();

router.use('/', require('./version.js'));
router.use('/resources', require('./resources.js'));
router.use('/roles', require('./roles.js'));
router.use('/tokens', require('./tokens.js'));
router.use('/topics', require('./topics.js'));
router.use('/users', require('./users.js'));

module.exports = router
