const DateTime = require('./dateTime');
const Settings = require('../settings');
const User = require('../templates/user');
const Random = require('../utils/random');
module.exports = {
    newUser: query => (currentDateTime => ({
        ...User,
        autelId: query.autelId,
        pwd: query.pwd,
        lastLoginTime: currentDateTime,
        regTime: currentDateTime,
        tokenCreateTime_maxiap: currentDateTime,
        token_maxiap: 'token',
        serialNo: query.autelId.split('@')[0],
        appPlatform: query.appPlatform||'',
        validDate: DateTime.getDemoDate(Settings.demo.hours),
        validCode: Random(1000,9999).toString(10),
        demoMsu: '',
        banned: query.banned
    }))(DateTime.getCurrentDateTime())
};