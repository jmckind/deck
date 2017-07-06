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
  }
};

try {
  config = require(process.env.DECK_CONF || '/etc/deck/config.js');
} catch (err) {
  console.error(err.message);
}

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const morgan     = require('morgan');
const port       = config.express.port || 4778;
const thinky     = require('thinky')(config.rethinkdb || {});
const type       = thinky.type;
const Errors     = thinky.Errors;
const r          = thinky.r;

var Attendee = thinky.createModel('Attendee', {
  first_name: type.string().required().min(1),
  last_name: type.string().required().min(2),
  email_address: type.string().required().email()
});

var Category = thinky.createModel('Category', {
  name: type.string().required().min(2),
  description: type.string().required()
});

var Resource = thinky.createModel('Resource', {
  name: type.string().required().min(1),
  type: type.string().required().enum('Link', 'Markdown', 'Plain Text'),
  content: type.string().required(),
  active: type.boolean().required().default(true),
  created_date: type.date().required().default(r.now()),
  modified_date: type.date().required().default(r.now()),
});

function handleDBError(res) {
  return function(error) {
    console.error(error.stack);
    res.status(400);
    return res.json({ error: error.message });
  }
}

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(config.express.log_format || 'combined'));
app.disable('x-powered-by');

var v1Router = express.Router();

v1Router.get('/', function(req, res) {
    res.json({ version: '1.0.0' });
});

v1Router.route('/attendees')
  .get(function(req, res) {
    Attendee.run().then(function(result) {
      res.json({ attendees: result });
    }).error(handleDBError(res));
  })
  .post(function(req, res) {
    var attendee = new Attendee(req.body);
    attendee.save().then(function(result) {
      res.status(201).json({ attendee: result });
    }).error(handleDBError(res));
  });

v1Router.route('/attendees/:id')
  .get(function(req, res) {
    Attendee.get(req.params.id).run().then(function(result) {
      res.json({ attendee: result });
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  })
  .put(function(req, res) {
    var attendee = new Attendee(req.body);
    Attendee.get(req.params.id).update(attendee).execute().then(function(result) {
      res.json({ attendee: result });
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  })
  .delete(function(req, res) {
    Attendee.get(req.params.id).delete().execute().then(function(result) {
      return res.sendStatus(204);
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  });

v1Router.route('/resources')
  .get(function(req, res) {
    var rdb = Resource;
    if (req.query.hasOwnProperty('active') && req.query.active !== "false" && req.query.active !== "0") {
      rdb = rdb.filter(r.row('active').eq(true));
    }
    if (req.query.hasOwnProperty('type')) {
      rdb = rdb.filter(r.row('type').eq(req.query.type));
    }
    rdb.run().then(function(result) {
      res.json({ resources: result });
    }).error(handleDBError(res));
  })
  .post(function(req, res) {
    var resource = new Resource(req.body);
    resource.save().then(function(result) {
      res.status(201).json({ resource: result });
    }).error(handleDBError(res));
  });

v1Router.route('/resources/:id')
  .get(function(req, res) {
    Resource.get(req.params.id).run().then(function(result) {
      res.json({ resource: result });
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  })
  .put(function(req, res) {
    var resource = new Resource(req.body);
    Resource.get(req.params.id).update(resource).execute().then(function(result) {
      res.json({ resource: result });
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  })
  .delete(function(req, res) {
    Resource.get(req.params.id).delete().execute().then(function(result) {
      return res.sendStatus(204);
    }).catch(Errors.DocumentNotFound, function(err) {
      return res.sendStatus(404);
    }).error(handleDBError(res));
  });

app.use('/v1/', v1Router);

app.use(function (req, res, next) {
  console.log('Route not found for URL: ' + req.originalUrl);
  res.sendStatus(404);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.json({ error: 'An unexpected error has occurred!' });
});

app.listen(port);
console.log('Listening on port ' + port);
