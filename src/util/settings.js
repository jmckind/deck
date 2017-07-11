var config = {
  rethinkdb: {
      host: 'localhost',
      port: 28015,
      authKey: '',
      db: 'deck'
  },
  express: {
      port: 4778,
      log_format: 'combined'
  },
  deck: {
    token_validity: 86400
  }
};

try {
  config = require(process.env.DECK_CONF || '/etc/deck/config.js');
} catch (err) {
  console.error(err.message);
}

module.exports = config
