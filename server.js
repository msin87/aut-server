const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const fileServer = express();
const controller = require('./controllers/users');
const PATHS = require('./settings');
const AutelStoreRouter = require('./routes/AutelStore');
// const Updater = require('./updater/updater');
mainServer.use(bodyParser.text({type: 'text/html'}));
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
fileServer.use((req,res,next)=>{
   console.log(`[File server request]\r\n${Date()}\r\nIP:${req.connection.remoteAddress.split(':')[3]}\r\nURL:${req.url}\r\n[End]`);
   next();
});
fileServer.use('/',express.static(PATHS.cars));
mainServer.use(AutelStoreRouter);

mainServer.listen(8082, () => console.log('MaxiAP server started'));
fileServer.listen(8080,() => console.log('File server started'));
