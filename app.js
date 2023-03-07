var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var collabsRouter = require('./routes/collabs');
var usersRouter = require('./routes/influencers');
var authRouter = require('./routes/auth')
var regUsersRouter = require ('./routes/users')

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/collabs', collabsRouter);
app.use('/influencers', usersRouter);
app.use('/users', regUsersRouter);

module.exports = app;
