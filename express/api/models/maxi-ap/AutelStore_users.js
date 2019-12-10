const Strings = require('../../../../templates/strings');
const Settings = require('../../../../settings');
const ResponseBuilder = require('../../../../utils/responseBuilder');
const db = require('../../../../nedb/index')(['clients']);
const Random = require('../../../../utils/random');
const strToBool = require('../../../../utils/strToBool');
const getUserState = (user) => {
    if (!user) return Strings.UserState.notExist;
    if (strToBool(user['banned'])) return Strings.UserState.banned;
    if (Date.parse(user['validDate']) <= Date.now()) return Strings.UserState.expired;
    return Strings.UserState.ok;
};
const model = {
    findByQuery: async query => ({
        err: `Telegram request: find user by query: ${JSON.stringify(query)}. From: ${query['username']}`,
        ...ResponseBuilder(await db.findAsync(...query), Strings.Errors.noError, Strings.Success.success)
    }),
    create: async query => {
        if ((await db.findOneAsync({autelId: query.autelId})).state !== Strings.UserState.notExist)
            return {
                err: `User ${query.autelId} registration failed. User already exists!`,
                ...ResponseBuilder(null, Strings.Errors.accountHasExist, Strings.Success.success)
            };
        switch (+query.validCode) {
            case +Settings.passwords.registerUser:
                return await db.insertAsync(query);
            case +Settings.passwords.banUser:
                await db.insertAsync({
                    ...query,
                    data: null,
                    banned: true,
                    err: `User ${query.autelId} registered as BANNED!`,
                    errcode: Strings.Errors.dataError,
                    success: Strings.Success.notSuccess
                });
                throw {err: `User ${query.autelId} registered as BANNED!`};
        }
    },
    loginCheck: async user => {
        const foundUser = await db.findOneAsync(user);
        switch (getUserState(foundUser)) {
            case Strings.UserState.expired:
                return {err: `User ${user.autelId}. Expired date! firstName: ${foundUser.data.firstName}`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)};
            case Strings.UserState.notExist:
                return {err: `User ${user.autelId} does not exist!`, ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)};
            case Strings.UserState.banned:
                return {
                    err: `User ${user.autelId} is blacklisted and will be banned!`,
                    banned: true, ...ResponseBuilder(null, Strings.Errors.communicationFailed, Strings.Success.notSuccess)
                };
            default:
                if (foundUser['pwd'] !== user['pwd'])
                    return {err: `User ${user.autelId}. Wrong password! firstName: ${foundUser.data.firstName}`, ...ResponseBuilder(null, Strings.Errors.wrongPassword, Strings.Success.notSuccess)};
                return {err: `User ${user.autelId} logged in!, firstName: ${foundUser.data.firstName} `, ...ResponseBuilder(foundUser.data, Strings.Errors.noError, Strings.Success.success)};
        }
    },
    validCode: () => ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success),
    resetPassword: async query => {
        let user;
        try {
            user = await db.findOneAsync({autelId: query.autelId});
            if (!user)
                return {err: `User ${query.autelId} does not exist!`, ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)};
            if (+user.validCode !== (+query.validCode))
                return {err: `User ${query.autelId}. Incorrect verification code: ${query.validCode}! Expected: ${user.validCode}`, ...ResponseBuilder(null, Strings.Errors.wrongConfirmCode, Strings.Success.notSuccess)};
            await db.updateAsync({autelId: userReq.autelId}, {
                ...user,
                pwd: query['newPwd'],
                validCode: Random(1000, 9999).toString(10)
            }, {});
            return {err: `User ${userReq.autelId} password reset successful`, ...ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)}
        } catch (err) {
            return {err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)}
        }
    }
};
module.exports = model;