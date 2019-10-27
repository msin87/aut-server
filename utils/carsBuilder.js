const SETTINGS = require('../settings');
const PATTERN_IP = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+\b/g;
const PATTERN_DNS = /http:\/\/(\w*\.\w*\.\w*)\b/g;
const fs = require('fs');
const Strings = require('../templates/strings');
const ResponseBuilder = require('./responseBuilder');
const DateTime = require('./dateTime');
const getCars = platfrom => new Promise((resolve, reject) => {
    fs.readFile(`responses/android${platfrom === 64 ? '64' : '32'}.json`, 'UTF8', (err, data) => {
        if (err) {
            reject(err)
        } else resolve(JSON.parse(data))
    })
});
module.exports = async (user,sys) => {
    let Cars;
    try {
        switch (+sys) {
            case 0:
                Cars = await getCars(64);
                break;
            case 1:
                break;
            case 2:
                Cars = await getCars(32);
                break;
        }
        Cars.curDate = DateTime.getCurrentDateTime();
        Cars.minSaleUnit = Cars.minSaleUnit.map(car => {
            car['sn'] = user.serialNo;
            // car.validDate = Date.parse(user.validDate) < Date.now() ? user.validDate : user.validDate.split(' ')[0];
            car['validDate'] = user.validDate.split(' ')[0];
            car['soft'] = car.soft.map(soft => {
                if (PATTERN_IP.test(soft['logo'])) {
                    soft['logo'] = soft['logo'].replace(PATTERN_IP, 'http://'+SETTINGS.ip.logos);
                    soft['softPackPath'] = soft['softPackPath'].replace(PATTERN_IP, 'http://'+SETTINGS.ip.soft);
                    soft['lgPackPath']=soft['lgPackPath'].replace(PATTERN_IP, 'http://'+SETTINGS.ip.lgPack);
                    return soft;
                }  if (PATTERN_DNS.test(soft['logo'])) {
                    soft['logo'] = soft['logo'].replace(PATTERN_DNS, 'http://'+SETTINGS.ip.logos);
                    soft['softPackPath'] = soft['softPackPath'].replace(PATTERN_DNS, 'http://'+SETTINGS.ip.soft);
                    soft['lgPackPath']=soft['lgPackPath'].replace(PATTERN_DNS, 'http://'+SETTINGS.ip.lgPack);
                    return soft;
                }
            });
            return car;
        });
        return Cars;
    } catch (e) {
        console.log(e);
        return null;
    }
};

