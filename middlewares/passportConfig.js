const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oidc');

const User = require('../models/user');
const FC = require('../models/fc');

(() => {
  // Username and password
  passport.use(
    'username and password',
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username }).exec();
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password',
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

  // Google OAuth2
  passport.use(
    'google OAuth',
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/google',
      scope: ['profile'],
    }, async (issuer, profile, done) => {
      try {
        const fC = await FC.findOne({ provider: issuer, subject: profile.id }).exec();
        if (!fC) { // New account
          const userNew = new User({
            displayName: profile.displayName,
          });
          const fCNew = new FC({
            provider: issuer,
            subject: profile.id,
            user: userNew._id,
          });
          await Promise.all([userNew.save(), fCNew.save()]);
          return done(null, userNew); // Authorize login
        }
        // Else, existing account
        const user = await User.findById(fC.user).exec();
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
