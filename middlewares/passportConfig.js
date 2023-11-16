const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

(() => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username }).exec();
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username of password',
          });
        } // Username does not exist
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        } // Wrong password
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, {
      displayName: user.displayName,
    });
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
})();
