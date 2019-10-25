const DEMO_PERIOD_HOURS = 24;
const DateTime = require('./dateTime');
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
        token_maxiap: query.autelId,
        serialNo: query.autelId.split('@')[0],
        appPlatform: query.appPlatform||'',
        validDate: DateTime.getDemoDateTime(DEMO_PERIOD_HOURS),
        validCode: Random(1000,9999).toString(10),
    }))(DateTime.getCurrentDateTime())
};