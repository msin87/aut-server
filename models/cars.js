const ResponseBuilder = require('../utils/responseBuilder');
const Strings = require('../templates/strings');
const CarsBuilder = require('../utils/carsBuilder');
const Users = require('./users');
const getAppPlatform = query => {
    if (JSON.stringify(query).indexOf('"sn"') === 1)
        return Strings.AppPlatform.android32;
    // if (JSON.stringify(query).indexOf('"sn"') > 1 && JSON.stringify(query).indexOf('"sn"') < 30)
    //     return Strings.AppPlatform.iOS;
    if (+query.sys===2 || ((JSON.stringify(query).indexOf('"sn"') !== 1)&&+query.sys===0))
        return Strings.AppPlatform.android64;
};
module.exports.all = async query => {
    if (!query.sn) return ({err: `Missing serial number in request`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
    const regExp = new RegExp(`${query.sn}@.*`);
    const user = await Users.getUser({autelId: {$regex: regExp}});
    const Cars = await CarsBuilder(user, getAppPlatform(query));
    switch (user.state) {
        case Strings.UserState.ok:
            return {err:`Sending cars to user ${user.data.autelId}`,...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notAllowed:
            return {err:`Sending empty cars to not allowed user ${user.data.autelId}`,...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notExist:
            return {err:`Sending empty cars to not exist user ${query.sn}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.expired:
            return {err:`Sending  cars to expired user ${user.data.autelId}`, ...ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)};
    }
};



// CarsBuilder(user, getAppPlatform(query))
//     .then(Cars => resolve(ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)))
//     .catch(err => reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)}))
// }
// }
// )
// })
// ;