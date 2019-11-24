const Strings = require('../templates/strings');
const Settings = require('../settings');
const ResponseBuilder = require('../utils/responseBuilder');
const UserBuilder = require('../utils/userBuilder');
const db = (require('../db.js'));
const Random = require('../utils/random');
const logger = require('../logger/logger');
const strToBool = require('../utils/strToBool');
const getUserState = (user, pwd = -1) => {
    if (!user) return Strings.UserState.notExist;
    if (strToBool(user['banned'])) return Strings.UserState.banned;
    if (strToBool(user['allowed'])) return Strings.UserState.notAllowed;
    if (Date.parse(user['validDate']) <= Date.now()) return Strings.UserState.expired;
    if (pwd !== user.pwd) return Strings.UserState.wrongPassword;
};
const findOne = async query => {
    try {
        const user = await db.findOneAsync(query);
        const userState = getUserState(user, query['pwd']);
        switch (userState) {
            case Strings.UserState.notExist:
                return {data: null, state: Strings.UserState.notExist};
            case Strings.UserState.banned:
                return {data: user, state: Strings.UserState.banned};
            case Strings.UserState.expired:
                return {data: user, state: Strings.UserState.expired};
            case Strings.UserState.notAllowed:
                return {data: user, state: Strings.UserState.notAllowed};
            case Strings.UserState.wrongPassword:
                return {data: user, state: Strings.UserState.wrongPassword};
            default:
                return {data: user, state: Strings.UserState.ok};
        }
    } catch (err) {
        return err;
    }
};
const loginCheck = async user => {
    const foundUser = await findOne(user);
    switch (foundUser.state) {
        case Strings.UserState.ok:
            return {err: `User ${user.autelId} logged in!, firstName: ${foundUser.data.firstName} `, ...ResponseBuilder(foundUser.data, Strings.Errors.noError, Strings.Success.success)};
        case Strings.UserState.notAllowed:
            return {err: `User ${user.autelId} does not allowed! firstName: ${foundUser.data.firstName}`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)};
        case Strings.UserState.expired:
            return {err: `User ${user.autelId}. Expired date! firstName: ${foundUser.data.firstName}`, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)};
        case Strings.UserState.notExist:
            return {err: `User ${user.autelId} does not exist!`, ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)};
        case Strings.UserState.wrongPassword:
            return {err: `User ${user.autelId}. Wrong password! firstName: ${foundUser.data.firstName}`, ...ResponseBuilder(null, Strings.Errors.wrongPassword, Strings.Success.notSuccess)};
        case Strings.UserState.banned:
            return {
                err: `User ${user.autelId} is blacklisted and will be banned!`,
                banned: true, ...ResponseBuilder(null, Strings.Errors.communicationFailed, Strings.Success.notSuccess)
            }
    }
};
const model = {
    all: async query => ({
        err: `Telegram request: get all users. From: ${query['username']}`,
        ...ResponseBuilder(await db.findAsync(), Strings.Errors.noError, Strings.Success.success)
    }),
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
    }
};


module.exports.getUser = getUser;

module.exports.findByQuery = query => new Promise((resolve, reject) =>
    db.findOne({...query}, (err, docs) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({err: `Telegram request: find user by query: ${JSON.stringify(query)}. From: ${query['username']}`, ...ResponseBuilder(docs, Strings.Errors.noError, Strings.Success.success)});
        }
    )
);
module.exports.create = async query => {
    const foundUser = await getUser(query);
    if (foundUser.state === Strings.UserState.notExist) {
        switch (+query.validCode) {
            case +Settings.passwords.registerUser:
                return await insertNewUser(query);
            case +Settings.passwords.banUser:
                await insertNewUser({
                    ...query,
                    data: null,
                    banned: true,
                    err: `User ${query.autelId} registered as BANNED!`,
                    errcode: Strings.Errors.dataError,
                    success: Strings.Success.notSuccess
                });
                throw {err: `User ${query.autelId} registered as BANNED!`};
            default:
                return {
                    err: `User ${query.autelId} registration failed. Wrong verification code ${query.validCode}! Expected: ${Settings.passwords.registerUser}`,
                    data: null,
                    errcode: Strings.Errors.wrongConfirmCode,
                    success: Strings.Success.notSuccess
                }
        }
    } else {
        return {
            err: `User ${query.autelId} registration failed. User already exists!`,
            data: null,
            errcode: Strings.Errors.accountHasExist,
            success: Strings.Success.notSuccess
        }
    }
    // db.insert(UserBuilder.newUser(query), (err, docs) =>
    //     dbCb(resolve, reject, err, docs, `User creating error: ${query}`, true))
};


module.exports.updateUserProperty = async (autelId, property) => await updateUserAsync(autelId, property, db);

module.exports.deleteUser = query => new Promise(async (resolve, reject) => {
    db.remove({autelId: query.autelId}, {}, (err, docs) => {
        if (err) {
            reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
        } else {
            db.persistence.compactDatafile();
            resolve({err: `User ${query.autelId} deleted`, ...ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)})
        }
    })
})
module.exports.validation = () => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. validation.`);
    return ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)
};
module.exports.resetPassword = userReq => new Promise((resolve, reject) => {
    db.findOne({autelId: userReq.autelId}, (err, user) => {
        if (err) {
            reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
        } else if (!user) {
            reject({
                err: `User ${userReq.autelId} does not exist!`,
                ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)
            });
        } else if (+user.validCode !== (+userReq.validCode)) {
            reject({
                err: `User ${userReq.autelId}. Incorrect verification code: ${userReq.validCode}! Expected: ${user.validCode}`,
                ...ResponseBuilder(null, Strings.Errors.wrongConfirmCode, Strings.Success.notSuccess)
            });
        } else {
            user.pwd = userReq['newPwd'];
            user.validCode = Random(1000, 9999).toString(10);
            db.update({autelId: userReq.autelId}, user, {}, (err) => {
                if (err) {
                    reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
                    return;
                }
                db.persistence.compactDatafile();
                resolve({err: `User ${userReq.autelId} password reset successful`, ...ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)})
            })
        }
    })
});
module.exports.addUser = async (query) => {
    try {
        const result = await insertUserAsync(UserBuilder.newUser(query));
        return {err: `Telegram request. New user ${query.autelId} created`, result}
    } catch (err) {
        return {err}
    }
};
module.exports.loginCheck = loginCheck;

