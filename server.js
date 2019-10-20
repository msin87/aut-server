const REQ_PATTERNS = {
    req64: '=nrJ',
    req32: '=nrR',
    apk: '9v.ioZNpn',
    login: '0Ct.8Nplt6fBvJfsmhfBZJplARQltMwFjyfKQRfsQ6fBAJvl36a5x.Qgcoi9flUgQ6wsc9fGFnfKQKvlj6vGmRvm89fFAhfot6wBFKvsf9w9fNiFryfK3JvKwyQrZNw5W3QgGNUnWoUFBoU2H.i.CrQ5xPi5sKQ-GoAmj,EZBPwrw.inGNpmsXwngPiF'
};
const SN = 'CAP2K3C01609';
const VALID_DATE = '2020-10-10';
const express = require('express');
const bodyParser = require('body-parser');
const mainServer = express();
const responses = {};
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

mainServer.post('/AutelStore.fcgi', (req, res) => {
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let reqString = '';
    if (typeof (req.body) === 'string')
        reqString = req.body;
    else if (typeof (req.body) !== 'string' && typeof (req.body['rqbody']) === 'string') {
        reqString = req.body['rqbody'];
    } else {
        console.log(Date() + `: ip ${remoteIp} Неправильный запрос.Не могу распознать BODY`);
        return res.sendStatus(400);
    }
    if (reqString.indexOf(REQ_PATTERNS.req64) >= 0) {
        responses.android64.data.result.curDate = dateString;
        responses.android64.data.result.minSaleUnit = responses.android64.data.result.minSaleUnit.map((val) => {
            val.sn = SN;
            val.validDate = VALID_DATE;
            return val;
        });
        res.send(responses.android64);
        console.log(Date() + `: ip ${remoteIp} Запрос от Android64`);
    } else if (reqString.indexOf(REQ_PATTERNS.req32) >= 0) {
        responses.android32.data.result.curDate = dateString;
        responses.android32.data.result.minSaleUnit = responses.android32.data.result.minSaleUnit.map((val) => {
            val.sn = SN;
            val.validDate = VALID_DATE;
            return val;
        });
        res.send(responses.android32);
        console.log(Date() + `: ip ${remoteIp} Запрос от Android32`);
    } else if (reqString.indexOf(REQ_PATTERNS.apk) >= 0) {
    } else {
        if (reqString.indexOf(REQ_PATTERNS.login.trim().slice(4, -2))) {
            res.send(responses.logon);
        }
    }
});
mainServer.listen(8082, () => {
        console.log('Server started');
    }
);
let dictionary = 'CjYm8ZBqaAz2wQsSx3WFc4GrfvH5EtgbJMR6yhKnT7uLiUkV,X9oPNl.0p!-[=]~'.split('');
let revDictionary = new Map();
dictionary.forEach((val, index) => {
    revDictionary.set(val, index);
});
let decodedStrDic = '';
const deMixBits = b => {
    return (b & 0x80) + ((b & 0x40) >> 6) + ((b & 0x20) >> 4) + ((b & 0x10) >> 2) + (b & 0x08) + ((b & 0x04) << 2) + ((b & 0x02) << 4) + ((b & 0x01) << 6);
}
for (let i = 0; i < REQ_PATTERNS.login.length; i += 4) {
    let A0 = revDictionary.get(REQ_PATTERNS.login[i]);
    let A1 = revDictionary.get(REQ_PATTERNS.login[i + 1]);
    let A2 = revDictionary.get(REQ_PATTERNS.login[i + 2]);
    let A3 = revDictionary.get(REQ_PATTERNS.login[i + 3]);

    let s0 = deMixBits(A0 << 2 | ((A1 >> 4) & 3));
    let s1 = deMixBits((A1 & 0x0F) << 4 | ((A2 >> 2) & 0x0F));
    let s2 = deMixBits(((A2 & 0x03) << 6) | (A3 & 0x3F));
    decodedStrDic = decodedStrDic + String.fromCharCode(s0) + String.fromCharCode(s1) + String.fromCharCode(s2);
}
console.log(decodedStrDic);