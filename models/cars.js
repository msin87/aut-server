const ResponseBuilder = require('../utils/responseBuilder');
const Strings = require('../templates/strings');
const CarsBuilder = require('../utils/carsBuilder');
const Users = require('./users');
const logger = require('../logger/logger');
const getAppPlatform = query => {
    if (+query.sys===2)
        return Strings.AppPlatform.android32;
    if (+query.sys===0)
        return Strings.AppPlatform.android64;
};
module.exports.all = async query => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars controller enter. Query: ${JSON.stringify(query)}`);
    if (!query.sn) return ({err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
    const regExp = new RegExp(`${query.sn}@.*`);
    const user = await Users.getUser({autelId: {$regex: regExp}});
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars controller after getUser. Query: ${JSON.stringify(query)}`);
    const appPlatfrom = getAppPlatform(query);
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars controller after getAppPlatform. Query: ${JSON.stringify(query)}`);
    const Cars = await CarsBuilder(user,appPlatfrom);
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars controller after CarsBuilder. Query: ${JSON.stringify(query)}`);
    switch (user.state) {
        case Strings.UserState.ok:
            return {err:`Sending ${appPlatfrom}bit cars to user ${user.data.autelId}, firstName: ${user.data.firstName}`,...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notAllowed:
            return {err:`Sending empty cars to not allowed user ${user.data.autelId}, firstName: ${user.data.firstName}`,...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notExist:
            return {err:`Sending empty cars to not exist user ${query.sn}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.expired:
            return {err:`Sending  cars to expired user ${user.data.autelId}, firstName: ${user.data.firstName}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
    }
};