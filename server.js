const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const fileServer = express();
const PATHS = require('./settings');
const AutelStoreRouter = require('./routes/AutelStore');
const logger =require('./logger/logger');
mainServer.use(bodyParser.text({type: 'text/html'}));
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
fileServer.use((req,res,next)=>{
    logger.FILE_REQUEST(`IP:${req.connection.remoteAddress.split(':')[3]}\r\nURL:${req.url}`);
   next();
});
fileServer.use('/',express.static(PATHS.cars));
mainServer.use(AutelStoreRouter);

mainServer.listen(8082, () => logger.INFO('MaxiAP server started'));
fileServer.listen(8080,() => logger.INFO('File server started'));
