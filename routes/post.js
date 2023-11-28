const express = require('express');
const controller = require('../controllers/postController');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const createLimiter = require('../middlewares/createLimiter');

const router = express.Router();

router.use(checkAuthenticated); // All routes below for authenticated users only

router.get('/create', controller.create_form_get);

router.post('/create', createLimiter(5), controller.create_form_post);

router.post('/delete', controller.delete_post);

router.post('/:id/pat-toggle', createLimiter(20), controller.pat_toggle_post); // Client expecting json

router.post('/:id/toggle-is-public', createLimiter(20), controller.public_toggle_post); // Client expecting json

router.get('/:id', controller.detail_get);

module.exports = router;
