const DateTime = require('./dateTime');
const Settings = require('../settings');
const User = require('../templates/user');
const Random = require('../utils/random');
const strToBool = require('../utils/strToBool');
module.exports = {
    newUser: query => (currentDateTime => ({
        ...User,
        allowed: strToBool(query.allowed),
        firstName: query.firstName||'',
        autelId: query.autelId,
        pwd: query.pwd,
        lastLoginTime: currentDateTime,
        regTime: currentDateTime,
        tokenCreateTime_maxiap: currentDateTime,
        token_maxiap: 'token',
        serialNo: query.autelId.split('@')[0],
        appPlatform: query.appPlatform||'',
        validDate: query.validDate||DateTime.getDemoDate(Settings.demo.hours),
        validCode: query.validCode||Random(1000,9999).toString(10),
        demoMsu: query.demoMsu||'',
        banned: strToBool(query.banned)
    }))(DateTime.getCurrentDateTime())
};