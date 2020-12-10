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
// app.get('/add-user', (req, res) => {
//   const user = new User({
//     name: 'Viet Dang',
//     mail: 'inf19155@lehre.dhbw-stuttgart.de',
//     password: '987654321'
//   });

//   user.save()
//     .then(result => {
//       res.send(result);
//     }).catch(err => console.log(err))
// });

// app.get('/add-event', (req, res) => {
//   const event = new Event({
//     title: 'Testevent',
//     start: '20-12-2020',
//     end: '20-12-2020',
//     body: 'Das ist nur ein Testevent um die Struktur zu testen',
//     user: {
//       _id: '5fd0cb44d70ca3d0922ea950'
//     }
//   });

//   event.save()
//     .then(result => {
//       res.send(result);
//     }).catch(err => console.log(err))
// });

// "/events" routes
app.get('/events', (req, res) => {
  Event.find()
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

app.post('/events', (req, res) => {
  const event = new Event(req.body);

  event.save()
    .then(result => {
      console.log('saved to DB');
      res.redirect('/events');
    }).catch(err => console.log(err));
});

app.get('/events/:id', (req, res) => {
  const id = req.params.id;
  Event.findById(id)
    .then(result => {
      res.send(result);
    }).catch(err => console.log(err));
});

app.delete('/events/:id', (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/events');
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