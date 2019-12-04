const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const AutelStoreRouter = require('./express/api/routes/maxiap/AutelStore');
const ClientsRouter = require('./express/api/routes/react-admin/clients');
const logger = require('./logger/logger');
mainServer.use((req,res,next)=>{
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`mainServer new request. IP: ${ req.headers['x-forwarded-for']}`);
    next();
});
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mainServer.use(AutelStoreRouter);
mainServer.use(ClientsRouter);
mainServer.listen(8083, () => logger.INFO('MaxiAP server started'));