var express = require('express');
var path = require('path');
var constants = require('./constants');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.locals.constants = constants;

app.use(function (req, res, next) {
  res.set('X-XSS-Protection', '0');
  next();
});

app.use(function (req, res, next) {
  var currentHeader;
  if (constants.headers.indexOf(req.query.header) === -1) {
    currentHeader = constants.headers[0];
  } else {
    currentHeader = req.query.header;
  }

  var policy;
  if (Array.isArray(req.query.policy)) {
    policy = req.query.policy[0];
  } else {
    policy = req.query.policy;
  }

  if (policy) {
    res.set(currentHeader, policy);
  }

  res.locals.policy = policy || constants.defaultPolicy;
  res.locals.currentHeader = currentHeader;

  next();
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(app.get('port'), function () {
  console.log('App started on ' + app.get('port'));
});
