const FILE_SERVER_IPPORT = '192.168.0.20:1234';
const ipPattern = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+\b/g;
const fs = require('fs');
const Strings = require('../templates/strings');
const ResponseBuilder = require('./responseBuilder');
const DateTime = require('./dateTime');
const getCars = platfrom => new Promise((resolve, reject) => {
    fs.readFile(`responses/android${platfrom === 64 ? '64' : '32'}.json`, 'UTF8', (err, data) => {
        if (err) {
            reject(err)
        }
        else resolve(JSON.parse(data))
    })
});
module.exports = async user => {
    let Cars;
    try {
        if (user.appPlatform === Strings.AppPlatform.android64) {
            Cars = await getCars(64);
        }
        else {
            Cars = await getCars(32);
        }
        Cars.curDate = DateTime.getCurrentDateTime();
        Cars.minSaleUnit = Cars.minSaleUnit.map(car => {
            car.sn = user.serialNo;
            car.validDate = Date.parse(user.validDate)<Date.now()?user.validDate:user.validDate.split(' ')[0];
            car.soft = car.soft.map(soft=>{
                soft['logo']=soft['logo'].replace(ipPattern,FILE_SERVER_IPPORT);
                soft['softPackPath']=soft['softPackPath'].replace(ipPattern,FILE_SERVER_IPPORT);
            })
            return car;
        });
        return Cars;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};

