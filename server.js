const REQ_PATTERNS = {
    req64: '=nrJ',
    req32: '=nrR',
    apk: 'apk'
};
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const responses = {};
responses.android32 = require('./responses/android32.json');
responses.android64 = require('./responses/android64.json');
responses.apk = require('./responses/android64.json');
app.use(bodyParser.text({type: 'text/html'}));
app.use(bodyParser.urlencoded(({extended: true})));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/AutelStore.fcgi', (req, res) => {
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (typeof (req.body) != 'string') {
        console.log(Date() + `: ip ${remoteIp} Неправильный запрос.Не могу распознать BODY`);
        return res.sendStatus(400);
    }
    responses.android64.data.result.curDate = dateString;
    if (req.body.indexOf(REQ_PATTERNS.req64) >= 0) {
        res.send(responses.android64);
        console.log(Date() + `: ip ${remoteIp} Запрос от Android64`);
    } else if (req.body.indexOf(REQ_PATTERNS.req32) >= 0) {
        res.send(responses.android32);
        console.log(Date() + `: ip ${remoteIp} Запрос от Android32`);
    } else if (req.body.indexOf(REQ_PATTERNS.apk) >= 0) {
    } else {
        res.sendStatus(400);
        console.log(Date() + `ip ${remoteIp} Неправильный запрос`);
    }
});
app.listen(8082, () => {
        console.log('Server started');
    }
);