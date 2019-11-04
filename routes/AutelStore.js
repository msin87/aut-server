const express = require('express');
const controllerAutel = require('../controllers/requestAutel');
const controllerTgrm = require('../controllers/requestTgrm');
const DecoderMiddleWare = require('../utils/encryptDecrypt').decoder;
const router = express.Router();
router.post('/AutelStore.fcgi', DecoderMiddleWare, express.query(), controllerAutel);
router.post('/tgapi', DecoderMiddleWare, express.query(), controllerTgrm);
module.exports = router;
