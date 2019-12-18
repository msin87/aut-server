const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const Router = require('./express/api/routes');
const logger = require('./logger/logger');
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`mainServer new request. IP: ${ req.headers['x-forwarded-for']}`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    next();
});

mainServer.use(Router);
mainServer.listen(8082, () => logger.INFO(' server started'));