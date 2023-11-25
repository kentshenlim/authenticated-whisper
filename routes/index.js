const express = require('express');
const controller = require('../controllers/indexController');
const checkAuthenticated = require('../middlewares/checkAuthenticated');

const router = express.Router();

router.use(checkAuthenticated); // All routes below for authenticated users only

router.get('/', controller.home_get);

router.get('/discover', controller.discover_get);

router.get('/me', controller.me_get);

module.exports = router;
