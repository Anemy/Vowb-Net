var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// session storage
var session     = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var lobbies = require('./routes/lobby');

var app = express();

// app.use(express.cookieParser());
// initialize the session
week = 1000*60*60*24*7;
app.use(session({
    secret: 'HUGE SECRET 123 321 VOWB.NIZZLE!',
    resave: true,
    saveUninitialized: true,
    cookie:{maxAge:week}
}));
// app.use(session({secret: 'HUGE SECRET 123 321 VOWB.NIZZLE'}));//express.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/lobby', lobbies);

//404 :'(
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { title: "404: Vowb.net page not found", url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');

  //add the not found error
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// manages socket io connections and client in lobby status
var lobby_manager = require('./lobby-manager/lobby');
// this creates a lobby listener at the port.
app.createLobbyListener = function(server) {
    // start listening to socket io
    lobby_manager.startListening(server);
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
