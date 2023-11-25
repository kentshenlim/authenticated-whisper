const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();

const loginPaths = [
  '/sign-in',
  '/sign-up',
  '/sign-in/federated/google',
  '/oauth2/redirect/google',
  '/sign-in/federated/facebook',
  '/oauth2/redirect/facebook',
  '/sign-in/email',
  '/sign-in/email/verify',
];

router.use((req, res, next) => { // Redirect user if already logged in
  if (req.isAuthenticated() && loginPaths.includes(req.path)) return res.redirect('/');
  return next();
});

router.get('/sign-in', controller.sign_in_get);

router.post('/sign-in', controller.sign_in_local_post);

router.get('/sign-up', controller.sign_up_local_get);

router.post('/sign-up', controller.sign_up_local_post);

router.post('/sign-in/federated/google', controller.sign_in_google_post);

router.get('/oauth2/redirect/google', controller.signed_in_google_get);

router.post('/sign-in/federated/facebook', controller.sign_in_facebook_post);

router.get('/oauth2/redirect/facebook', controller.signed_in_facebook_get);

router.get('/sign-in/email', controller.sign_in_email_get);

router.post('/sign-in/email', controller.sign_in_email_post);

router.get('/sign-in/email/verify', controller.signed_in_email_get);

router.get('/sign-out', controller.sign_out);

module.exports = router;
