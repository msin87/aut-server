const ResponseBuilder = require('../../../../utils/responseBuilder');
const Cars = require('../react-admin')(['cars'])['cars'];
const Users = require('../react-admin')(['clients'])['clients'];
const Strings = require('../../../../templates/strings');
const CarsBuilder = require('../../../../utils/carsBuilder');
const strToBool = require('../../../../utils/strToBool');
const DateTime = require('../../../../utils/dateTime');
const getAppPlatform = query => {
    if (+query.sys === 2)
        return Strings.AppPlatform.android32;
    if (+query.sys === 0)
        return Strings.AppPlatform.android64;
};
const getUserState = (user) => {
    if (!user) return Strings.UserState.notExist;
    if (strToBool(user['banned'])) return Strings.UserState.banned;
    if (Date.parse(user['validDate']) <= Date.now()) return Strings.UserState.expired;
    return Strings.UserState.ok;
};
// (async () => {
//     const cars = await model({sn: 'CAP12345678', sys: 64,});
//     const inserted = cars.all().insertUserData().result();
//     console.dir(all);
// })();
// module.exports.all = async (query, user) => {
//     if (!query.sn) return ({err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
//     const appPlatfrom = getAppPlatform(query);
//     const Cars = await CarsBuilder(user, appPlatfrom);
//     switch (user.state) {
//         case Strings.UserState.ok:
//             return {err: `Sending ${appPlatfrom}bit cars to user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
//         case Strings.UserState.notAllowed:
//             return {err: `Sending empty cars to not allowed user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
//         case Strings.UserState.notExist:
//             return {err: `Sending empty cars to not exist user ${query.sn}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
//         case Strings.UserState.expired:
//             return {err: `Sending  cars to expired user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
//     }
// };
module.exports = async query => {
    let result;
    if (!query.sn)
        throw {err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)};
    let cars = await Cars.getList({});
    const user = {data: await Users.getOne({autelId: {$regex: new RegExp(`${query.sn}@.*`)}})};
    return {
        all() {
            this.cars = cars.docs.filter(val => val['id'] === 'android' + query.sys)[0][`android${query.sys}`];
            return this;
        },
        insertUserData() {
            if (!this.cars) throw new Error('Please, run all() before');
            try {
                this.cars = {minSaleUnit: CarsBuilder(user, this.cars), curDate:DateTime.getCurrentDateTime()};
                switch (getUserState(user.data)) {
                    case Strings.UserState.ok:
                        result = {err: `Sending ${query.sys}bit cars to user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(this.cars, Strings.Errors.noError, Strings.Success.success)};
                        break;
                    case Strings.UserState.notExist:
                        result = {err: `Sending empty cars to not exist user ${query.sn}`, ...ResponseBuilder(this.cars, Strings.Errors.noError, Strings.Success.success)};
                        break;
                    case Strings.UserState.expired:
                        result = {err: `Sending  cars to expired user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(this.cars, Strings.Errors.noError, Strings.Success.success)};
                        break;
                    default:
                        result = {err: `Sending empty cars to not allowed user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(this.cars, Strings.Errors.noError, Strings.Success.success)};
                        break;
                }
                return this;
            } catch (err) {
                throw err;
            }
        },
        result() {
            return result;
        }

    }
};