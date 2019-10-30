const express = require('express');
const controller = require('../controllers/request');
const DecoderMiddleWare = require('../utils/encryptDecrypt').decoder;
const router = express.Router();
router.post('/AutelStore.fcgi', DecoderMiddleWare, express.query(), controller);
module.exports = router;
