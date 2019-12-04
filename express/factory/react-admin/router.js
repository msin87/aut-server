const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
module.exports = (rootPath,controller) => {
    router.get(`${rootPath}`,controller.getList);
    router.get(`${rootPath}/:id`,controller.getOne);
    router.post(`${rootPath}/:id`, bodyParser.json(), express.query(), controller.create);
    router.put(`${rootPath}/:id`,bodyParser.json(), express.query(), controller.update);
    router.delete(`${rootPath}/:id`, controller.delete);
    return router;
};