const express = require('express');
const controller = require('../controllers/indexController');

const router = express.Router();

router.get('/', controller.home_get);

router.get('/discover', controller.discover_get);

router.get('/me', controller.me_get);

module.exports = router;
