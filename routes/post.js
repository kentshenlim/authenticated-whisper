const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

router.get('/create', controller.create_form_get);

router.post('/create', controller.create_form_post);

router.post('/delete', controller.delete_post);

router.post('/:id/pat-toggle', controller.pat_toggle_post);

router.get('/:id', controller.detail_get);

module.exports = router;
