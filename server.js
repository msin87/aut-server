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
app.get('/', function (req, res) {
    res.send('Hello');
});
app.post('/32', (req, res) => {
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    if (!req.body) {
        console.log(Date() + ': Неправильный запрос.Не могу распознать BODY');
        return res.sendStatus(400);
    }
    if (req.headers["user-agent"].indexOf('Win64') >= 0 && req.headers["user-agent"].indexOf('Chrome') >= 0) {
        if (req.body.indexOf('=nrJ') >= 0) {
            res.send(responses.android32);
            text.data.result.curDate = dateString;
            console.log(Date() + ': Правильный запрос');
        } else {
            res.sendStatus(400);
            console.log(Date() + ': Неправильный запрос');
        }

    } else {
        res.sendStatus(400);
        console.log(Date() + ': Неправильный запрос. Другая система');
    }

});
app.listen(8082, () => {
        console.log('Server started');
    }
);