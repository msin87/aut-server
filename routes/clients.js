const express = require('express');
const controller = require('../controllers/clients');
const router = express.Router();
router.get('/users/:id',controller.getOne);
router.get('/users',controller.getList);
module.exports = router;