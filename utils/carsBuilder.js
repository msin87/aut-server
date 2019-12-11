const SETTINGS = require('../settings');
const PATTERN_IP = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+\b/g;
const PATTERN_DNS = /http:\/\/(\w*\.\w*\.\w*)\b/g;
const fs = require('fs');
const DateTime = require('./dateTime');
const Strings = require('../templates/strings');
const logger = require('../logger/logger');
const getCars = platform => new Promise((resolve, reject) => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`CarsBuilder. getCars. Enter. platform: ${platform}`);
    fs.readFile(`responses/android${platform}.json`, 'UTF8', (err, data) => {
        if (err) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`CarsBuilder. getCars. Error. platform: ${platform}`);
            reject(err)
        } else {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`CarsBuilder. getCars. Resolve. platform: ${platform}`);
            resolve(JSON.parse(data))
        }
    })
});

module.exports =  (user, cars) => {
    try {
        let validDate = user.data ? user.data.validDate.split(' ')[0] : '';
        if (user.state === Strings.UserState.notAllowed || user.state === Strings.UserState.notExist) {
            validDate = '';
        }
        cars.curDate = DateTime.getCurrentDateTime();
        cars.minSaleUnit = cars.minSaleUnit.map(car => {
            car['sn'] = user.data ? user.data.serialNo : '';
            if (!user.data) {
                car['validDate'] = '';
            } else {
                if (!user.data.demoMsu) {
                    car['validDate'] = validDate;
                } else {
                    car['validDate'] = user.data.demoMsu === car.code ? validDate : '';
                }
            }
            car['soft'] = car.soft.map(soft => {
                if (PATTERN_IP.test(soft['logo'])) {
                    soft['logo'] = soft['logo'].replace(PATTERN_IP, 'http://' + SETTINGS.ip.logos);
                    soft['softPackPath'] = soft['softPackPath'].replace(PATTERN_IP, 'http://' + SETTINGS.ip.soft);
                    soft['lgPackPath'] = soft['lgPackPath'].replace(PATTERN_IP, 'http://' + SETTINGS.ip.lgPack);
                    return soft;
                }
                if (PATTERN_DNS.test(soft['logo'])) {
                    soft['logo'] = soft['logo'].replace(PATTERN_DNS, 'http://' + SETTINGS.ip.logos);
                    soft['softPackPath'] = soft['softPackPath'].replace(PATTERN_DNS, 'http://' + SETTINGS.ip.soft);
                    soft['lgPackPath'] = soft['lgPackPath'].replace(PATTERN_DNS, 'http://' + SETTINGS.ip.lgPack);
                    return soft;
                }
            });
            return car;
        });
        return cars;
    } catch (error) {
        logger.ERROR(error||error.message);
        return null;
    }
};

