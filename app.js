require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const debug = require('debug')('app');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const compression = require('compression');
const helmet = require('helmet');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const meRouter = require('./routes/me');
const discoverRouter = require('./routes/discover');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// database setup
(async () => {
  const mongoDB = process.env.MONGODB_URL;
  mongoose.connect(mongoDB);
})().catch((err) => {
  debug(err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Deployment setup
// Compress response before sending
app.use(compression());
// Helmet HTTP headers, allowing only certain cross-site scripts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'unpkg.com'],
        connectSrc: ["'self'", 'unpkg.com'],
      },
    },
  }),
);

// Pass user to local environment
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', authRouter);
app.use('/', indexRouter); // Authenticated path
app.use('/', meRouter); // Authenticated path
app.use('/discover', discoverRouter); // Authenticated path
app.use('/user', userRouter); // Authenticated path
app.use('/post', postRouter); // Authenticated path

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
  });
});

module.exports = app;
