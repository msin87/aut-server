const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controllers/clients');
const router = express.Router();

router.get('/clients',controller.getList);
router.get('/clients/:id',controller.getOne);
router.post('/clients/:id', bodyParser.json(), express.query(), controller.create);
router.put('/clients/:id',bodyParser.json(), express.query(), controller.update);
router.delete('/clients/:id', controller.delete);
module.exports = router;