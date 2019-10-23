const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const ReqDecoder = require('./ReqDecoder');
const CmdSwitch = require('./cmd/cmdSwitch');
const responses = {};
const decoder = (req, res, next) => {
    const decoded = ReqDecoder(req.body['rqbody']);
    req.url = req.url + '?' + decoded;
    req.query = null;
    console.log(`[MaxiAP request]\r\n${Date()}\r\nIP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(':')[3]}\r\n${decoded}\r\n[End]`);
    next();
};
responses.android32 = require('./responses/android32.json');
responses.android64 = require('./responses/android64.json');
responses.logon = require('./responses/logon.json');
responses.apk = require('./responses/android64.json');
mainServer.use(bodyParser.text({type: 'text/html'}));
mainServer.use(bodyParser.urlencoded(({extended: true})));
mainServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
mainServer.post('/AutelStore.fcgi', decoder, express.query(), CmdSwitch);
mainServer.listen(8082, () => {
        console.log('Server started');
    }
);
