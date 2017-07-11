var config     = require('./settings.js');
var middleware = require('../middleware/index.js');
var routes     = require('../routes/index.js');
var express    = require('express');
var bodyParser = require('body-parser');
var cors       = require('cors');
var morgan     = require('morgan');

var app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(config.express.log_format || 'combined'));
app.use(middleware.token);
app.use('/v1/', routes);

app.use(function (req, res, next) {
  console.log('Route not found for URL: ' + req.originalUrl);
  res.status(404).send('');
});

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Unexpected Error' });
});

var apiApp = {
  expressApp: app,
  listen: function() {
    app.listen(config.express.port);
    console.log('Listening on port ' + config.express.port);
  }
};

module.exports = apiApp
