const ResponseBuilder = require('../../../../utils/responseBuilder');
const raModel = require('../react-admin')(['cars'])['cars'];
const Strings = require('../../../../templates/strings');
const CarsBuilder = require('../../../../utils/carsBuilder');
const getAppPlatform = query => {
    if (+query.sys===2)
        return Strings.AppPlatform.android32;
    if (+query.sys===0)
        return Strings.AppPlatform.android64;
};
const Cars = ()
const all = async sys => {
    let Cars;
    try {
        Cars = await raModel.getList({});
        return Cars.docs.filter(val=>val['id']==='android'+sys)[0][`android${sys}`];
    }
    catch (err) {
        throw err
    }
};
const modifyCars = ({cars}) => {

};
all({sn:'123123312',sys: 32},{});
module.exports.all = async (query,user) => {
    if (!query.sn) return ({err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
    const appPlatfrom = getAppPlatform(query);
    const Cars = await CarsBuilder(user,appPlatfrom);
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