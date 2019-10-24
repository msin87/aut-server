const fs = require('fs');
const Strings = require('../templates/strings');
const ResponseBuilder = require('./responseBuilder');
const DateTime = require('./dateTime');
const getCars = platfrom => new Promise((resolve, reject) => {
    fs.readFile(`../responses/android${platfrom === 64 ? '64' : '32'}.json`, 'UTF8', (err, data) => {
        if (err) {
            reject(err)
        }
        else resolve(data)
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
            car.validDate = user.validDate;
            return car;
        });
        return Cars;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};

