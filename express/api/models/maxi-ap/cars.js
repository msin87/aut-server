const ResponseBuilder = require('../../../../utils/responseBuilder');
const Cars = require('../react-admin')(['cars'])['cars'];
const Users = require('../react-admin')(['users'])['users'];
const Strings = require('../../../../templates/strings');
const CarsBuilder = require('../../../../utils/carsBuilder');
const getAppPlatform = query => {
    if (+query.sys === 2)
        return Strings.AppPlatform.android32;
    if (+query.sys === 0)
        return Strings.AppPlatform.android64;
};

const model = async query => {
    if (!query.sn)
        throw {err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)};
    const result = await Cars.getList({});
    const user = await Users.getList({autelId: {$regex: new RegExp(`${query.sn}@.*`)}});
    return {
        all: () => {
                this.cars = result.docs.filter(val => val['id'] === 'android' + query.sys)[0][`android${query.sys}`];
                return this;
        },
        insertUserData: async () => {
            try{

                return this;
            }
            catch (err) {
                throw err;
            }
        }

    }
};
(async () =>{
    await model({sn:'CAP12345678@user.com',sys:64,});
})();
module.exports.all = async (query, user) => {
    if (!query.sn) return ({err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
    const appPlatfrom = getAppPlatform(query);
    const Cars = await CarsBuilder(user, appPlatfrom);
    switch (user.state) {
        case Strings.UserState.ok:
            return {err: `Sending ${appPlatfrom}bit cars to user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notAllowed:
            return {err: `Sending empty cars to not allowed user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notExist:
            return {err: `Sending empty cars to not exist user ${query.sn}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.expired:
            return {err: `Sending  cars to expired user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
    }
};