var config = require('./settings.js');

module.exports = require('thinky')(config.rethinkdb || {})
