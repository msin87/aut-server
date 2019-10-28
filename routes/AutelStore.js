const express = require('express');
const controller = require('../controllers/users');
const DecoderMiddleWare = require('../utils/encryptDecrypt').decoder;
const encoder = require('../utils/encryptDecrypt').encoder;
const router = express.Router();
router.post('/AutelStore.fcgi', DecoderMiddleWare, express.query(), controller);
module.exports = router;
