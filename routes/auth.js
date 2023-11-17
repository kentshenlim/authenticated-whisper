const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();

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

router.get('/sign-in/email/check', controller.check_email_get);

// router.post('/sign-in/email/verify', controller.signed_in_email_post);

router.get('/sign-out', controller.sign_out);

module.exports = router;
