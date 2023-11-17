const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oidc');
const FacebookStrategy = require('passport-facebook');
const MagicLinkStrategy = require('passport-magic-link').Strategy;
const nodemailer = require('nodemailer');

const User = require('../models/user');
const FC = require('../models/fc');

(() => {
  // Username and password
  passport.use(
    'username-password',
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
    'google-OAuth',
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

  // Facebook OAuth2
  passport.use(
    'facebook-OAuth',
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/facebook',
      state: true,
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const fC = await FC.findOne({
          provider: 'https://www.facebook.com',
          subject: profile.id,
        }).exec();
        if (!fC) {
          const userNew = new User({
            displayName: profile.displayName,
          });
          const fCNew = new FC({
            provider: 'https://www.facebook.com',
            subject: profile.id,
            user: userNew._id,
          });
          await Promise.all([userNew.save(), fCNew.save()]);
          return done(null, userNew);
        }
        const user = await User.findById(fC.user).exec();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  // Email magic link
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.MAGIC_LINK_EMAIL,
      pass: process.env.MAGIC_LINK_PASSWORD,
    },
  });
  passport.use(
    'magic-link',
    new MagicLinkStrategy(
      // First argument is config object
      {
        secret: process.env.MAGIC_LINK_SECRET,
        userFields: ['email'],
        tokenField: 'token',
        verifyUserAfterToken: true,
      },
      // Second argument is send function
      (user, token) => {
        const link = `${process.env.DOMAIN_NAME}/sign-in/email/verify?token=${token}`;
        const mailData = {
          from: process.env.MAGIC_LINK_EMAIL,
          to: user.email,
          subject: 'Sign in to authenticated-whisper',
          html: '<h1> Welcome</h1>. Click the link below to finish signing in to authenticated-whisper. \r\n\r\n' + `<a href=${link}>${link}</a>`,
        };
        return transporter.sendMail(mailData);
      },
      // Third argument is verify function
      async (user) => {
        const userExist = await User.findOne({
          email: user.email,
        }).exec();
        if (!userExist) {
          const userNew = new User({
            displayName: user.email,
            email: user.email,
          });
          await userNew.save();
          return userNew;
        } return userExist;
      },
    ),
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
