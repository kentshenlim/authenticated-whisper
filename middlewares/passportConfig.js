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
        const h1 = '<h1>Log in to <span style="color: #a855f7cc;">authenticated-whisper</span></h1>';
        const p = '<p>You asked us to send you a magic link for quickly signing into your authenticated-whisper account. <span style="font-weight: bold;">DO NOT click the button if you have not make the request.</span></p>';
        const btn = `<a href=${link} style="align-self: center; font-size: 20px;display: inline-block; background: #a855f7cc; color: white; padding: 5px 10px; text-decoration: none; border-radius:5px;">Sign in to authenticated-whisper</a>`;
        const note1 = '<p>The button will expire in 30 mins and can be used only once.</p>';
        const note2 = '<p style="color: gray; font-size: 12px; text-align: left;">If you did not initiate this request, it is possible that someone may have inadvertently entered your email. If so, please disregard this email. Please report to the administrator by replying to this email if you suspect someone is abusing this email sender.</p>';
        const note3 = '<p style="color: gray; font-size: 12px; text-align: left;">This is an open-source project for practice; GitHub repository: https://github.com/kentshenlim/authenticated-whisper</p>';
        const mailData = {
          from: process.env.MAGIC_LINK_EMAIL,
          to: user.email,
          subject: 'Sign in to authenticated-whisper',
          html: `<div style="padding: 3rem 1.5rem; border-radius: 0.5rem; margin: 0 auto; display: flex; flex-direction: column; text-align: center; max-width:75ch; border: solid #a855f7cc 2px;">${h1}${p}${btn}${note1}${note2}${note3}</div>`,
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
      _id: user._id,
      displayName: user.displayName,
      username: user.username,
      displayPicture: user.jdenticonSrc, // Need to convert to base 64 for browser rendering
    });
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
})();
