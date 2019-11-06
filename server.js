const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const dbCleaner = require('./utils/dbcleaner');
const AutelStoreRouter = require('./routes/AutelStore');
const logger = require('./logger/logger');
const Settings = require('./settings');
const Firewall = require('./utils/firewall');
const firewall = Firewall(Settings.firewall);
mainServer.use((req,res,next)=>{
    firewall.core(req.connection.remoteAddress.split(':')[3]);
    next();
});
mainServer.use(bodyParser.text({type: 'text/html'}));
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mainServer.use(AutelStoreRouter);

mainServer.listen(8082, () => logger.INFO('MaxiAP server started'));

dbCleaner.start();