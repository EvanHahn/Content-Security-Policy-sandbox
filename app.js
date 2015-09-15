var express = require('express');
var path = require('path');
var browserify = require('browserify-middleware');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.set('X-XSS-Protection', '0');
  next();
});

app.use(function (req, res, next) {
  var csp = req.query.csp;

  if (Array.isArray(csp)) {
    csp = csp[0];
  }

  if (!csp) {
    res.locals.csp = "default-src 'self'";
    next();
    return;
  }

  res.set('Content-Security-Policy', csp);

  res.locals.csp = csp;

  next();
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/main.js', browserify(path.resolve(__dirname, 'assets', 'main.js')));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(app.get('port'), function () {
  console.log('App started on ' + app.get('port'));
});
