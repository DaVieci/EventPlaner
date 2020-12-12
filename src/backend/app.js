var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

var indexRouter = require('./routes/index');
var eventRoutes = require('./routes/eventRoutes');
var userRoutes = require('./routes/userRoutes');
var categoryRoutes = require('./routes/categoryRoutes');
const { JsonWebTokenError } = require('jsonwebtoken');

var app = express();

// connect to mongodb
const mongopw = 'MAC@nuf0peal-thon';
const dbURI = 'mongodb+srv://bela_and_viet:' + mongopw + '@cluster0.tiroe.mongodb.net/eventplanner?retryWrites=true&w=majority';

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

function authenticateToken(req, res, next) {
  const authHeader = req.header['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) return res.status(401).send('you dont have access');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.staus(403).send('token not valid');

    req.user = user;
    next();
  })
}

// user routes
app.use(userRoutes);

// event routes
app.use(eventRoutes);

// category routes
app.use(categoryRoutes);

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