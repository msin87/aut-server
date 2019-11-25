const express = require('express');
const controller = require('../controllers/users');
const router = express.Router();
router.get('/users/:id',controller.getOne);
router.get('/users',controller.getList);
module.exports = router;