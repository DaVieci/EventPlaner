var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const Event = require('./models/events.js');
const User = require('./models/users.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// connect to mongodb
const mongopw = 'MAC@nuf0peal-thon';
const mongoURI = 'mongodb+srv://bela_and_viet:' + mongopw + '@cluster0.tiroe.mongodb.net/eventplanner?retryWrites=true&w=majority';
//const dbURI = 'mongodb://localhost:27017/eventplanner';
const dbURI = mongoURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log('Connected to mongodb'))
    .catch(err => console.log(err));

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

// mongoose and mongo sandbox routes
app.get('/add-user', (req, res) => {
  const user = new User({
    name: 'Bela Föhrenbacher',
    mail: 'inf19017@lehre.dhbw-stuttgart.de',
    password: '123456789'
  });

  user.save()
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err))
});

app.get('/add-event', (req, res) => {
  const event = new Event({
    title: '...',
    body: 'yay',
    date: Date()
  });

  event.save()
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err))
});

app.get('/all-events', (req, res) => {
  Events.find()
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

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