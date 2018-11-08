var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ws = require('ws').Server;
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var wss = new ws({port:3001});
var cout = 0;
wss.on('connection', function(ws){
  console.log('co nguoi ket noi');
  ws.on('message', function (message) {
    console.log('receive data : ', message.toString());
  });
  // test send data
  var Interval = setInterval(
    function(){
      cout ++;
      console.log('Sending : ', cout);
      ws.send(cout.toString());
    }, 1000
  );
  ws.on('error', function(err) {
    console.log('Found error: ' + err);
  });
  ws.on('close',function () {
    clearInterval(Interval);
    console.log('Co nguoi thoat!')
  })
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
