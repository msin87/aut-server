const Strings = require('../templates/strings');
const Settings = require('../settings');
const ResponseBuilder = require('../utils/responseBuilder');
const UserBuilder = require('../utils/userBuilder');
const db = (require('../db.js')).db;
const backupDb = (require('../db.js')).backupDb;
const Random = require('../utils/random');
const logger = require('../logger/logger');
const strToBool = str => {
    if (typeof (str) === 'boolean') return str;
    switch (str.toLowerCase()) {
        case "false":
        case "no":
        case "0":
        case "":
            return false;
        default:
            return true;
    }
};
const dbCb = (resolve, reject, err, docs, msgNotFound, doCleanData = false) => {
    if (err) {
        reject({error: err})
    } else if (!docs) {
        reject({error: msgNotFound})
    } else
        resolve(ResponseBuilder(doCleanData ? null : {result: docs}, Strings.Errors.noError, Strings.Success.success));
};
const insertNewUser = (query, dataBase = db) => new Promise((resolve, reject) => {
    dataBase.insert(UserBuilder.newUser(query), (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({data: null, errcode: Strings.Errors.noError, success: Strings.Success.success})
    })
});
const insertUserAsync = user => new Promise((resolve, reject) => {
    db.insert(user, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({data: null, errcode: Strings.Errors.noError, success: Strings.Success.success})
    })
});
const removeByAutelIdAsync = (autelId, dataBase = db) => new Promise((resolve, reject) => {
    dataBase.remove({autelId}, {}, err => {
        if (err) {
            reject(err)
        } else {
            resolve();
        }
    })
});
const getUser = (user, dataBase = db) => new Promise((resolve, reject) => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. getUser: enter. User: ${JSON.stringify(user)}`);
    if (!user.hasOwnProperty('autelId')) {
        resolve({data: null, state: Strings.UserState.notExist});
        return;
    }
    dataBase.findOne({autelId: user.autelId}, (err, doc) => {
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback enter. User: ${JSON.stringify(user)}`);
        if (err) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback error. User: ${JSON.stringify(user)}`);
            reject(err);
            return;
        }
        if (!doc) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback. Not found. User: ${JSON.stringify(user)}`);
            resolve({data: null, state: Strings.UserState.notExist});
            return;
        }
        if (doc.hasOwnProperty('banned')) {
            if (strToBool(doc['banned'])) {
                if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback.User banned. User: ${JSON.stringify(user)}`);
                resolve({data: doc, state: Strings.UserState.banned});
                return;
            }
        }
        if (!doc['validDate'] || !strToBool(doc['allowed'])) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback.User not allowed or wrong validDate. User: ${JSON.stringify(user)}`);
            resolve({data: doc, state: Strings.UserState.notAllowed});
            return;
        }
        if (user.pwd && (doc.pwd !== user.pwd)) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback.User wrong password. User: ${JSON.stringify(user)}`);
            resolve({data: doc, state: Strings.UserState.wrongPassword});
            return;
        }
        if (Date.parse(doc['validDate']) < Date.now()) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback.User expired. User: ${JSON.stringify(user)}`);
            resolve({data: doc, state: Strings.UserState.expired});
            return;
        }
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. dataBase.findOne callback.User ok. User: ${JSON.stringify(user)}`);
        resolve({data: doc, state: Strings.UserState.ok});
    })
});
const loginCheck = async user => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. loginCheck enter. User: ${JSON.stringify(user)}`);
    const foundUser = await getUser(user);
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. loginCheck. User found. User: ${JSON.stringify(user)}`);
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

module.exports.all = query => new Promise((resolve, reject) =>
    db.find({}, (err, notExpiredDocs) => {
        if (err) {
            reject(err);
            return;
        }
        backupDb.find({}, (err, expiredDocs) => {
            if (err) {
                reject(err);
                return;
            }
            notExpiredDocs = notExpiredDocs || [];
            resolve({err: `Telegram request: get all users. From: ${query['username']}`, ...ResponseBuilder(notExpiredDocs.concat(expiredDocs), Strings.Errors.noError, Strings.Success.success)});
        })

    }));

module.exports.getUser = getUser;

module.exports.findByQuery = query => new Promise((resolve, reject) =>
    db.findOne({...query}, (err, notExpiredDocs) => {
        if (err) {
            reject(err);
            return;
        }
        backupDb.findOne({...query}, (err, expiredDocs) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({err: `Telegram request: find user by query: ${JSON.stringify(query)}. From: ${query['username']}`, ...ResponseBuilder(notExpiredDocs || expiredDocs, Strings.Errors.noError, Strings.Success.success)});
        })
    }));
module.exports.create = async query => {
    if (logger.settings.level === 'DEBUG') if (logger.settings.level === 'DEBUG') logger.DEBUG;
    const foundUser = await getUser(query);
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. Create. User found. Query: ${JSON.stringify(query)}`);
    const oldUser = await getUser(query, backupDb);
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. Create. Old user found. Query: ${JSON.stringify(query)}`);
    if (oldUser.state !== Strings.UserState.notExist) {
        return {
            err: `User ${query.autelId} registration failed. User already exists in the old_users.db!`,
            data: null,
            errcode: Strings.Errors.accountHasExist,
            success: Strings.Success.notSuccess
        }
    }
    if (foundUser.state === Strings.UserState.notExist) {
        switch (+query.validCode) {
            case +Settings.passwords.registerUser:
                if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. Create. Inserting user. Query: ${JSON.stringify(query)}`);
                return await insertNewUser(query);
            case +Settings.passwords.banUser:
                if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. Create. Inserting banned user. Query: ${JSON.stringify(query)}`);
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


module.exports.updateUserProperty = (autelId, property) => new Promise((resolve, reject) =>
    db.update({autelId: autelId}, {$set: {[property.key]: property.value}}, {}, (err, docs) => {
        if (err) {
            reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
            return;
        } else {
            db.persistence.compactDatafile();
            resolve({err: `User ${autelId} updated. Property: ${property.key} = ${property.value}`, ...ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)})
        }
    }));
module.exports.setNewValidDate = async query => {
    try {
        const expiredUser = (await getUser(query, backupDb)).data;
        const notExpiredUser = (await getUser(query)).data;
        let user;
        if (expiredUser) {
            await removeByAutelIdAsync(query.autelId, backupDb);
            user = expiredUser;
        }
        if (notExpiredUser) {
            await removeByAutelIdAsync(query.autelId);
            user = notExpiredUser;
        }
        user.validDate = query.validDate;
        if (Date.parse(query.validDate + 'T23:59:59') <= Date.now()) {
            await insertUserAsync(user, backupDb);
        } else {
            await insertUserAsync(user, db);
        }
        return ({err: `User ${user.autelId} validDate updated. New validDate: ${user.validDate}`, ...ResponseBuilder(user, Strings.Errors.noError, Strings.Success.success)})
    } catch (err) {
        return {err}
    }
};
module.exports.deleteUser = user => new Promise((resolve, reject) =>
    db.remove({autelId: user}, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${user}`)));

module.exports.validation = () => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`User model. validation.`);
    return ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success)
};


module.exports.resetPassword = userReq => new Promise((resolve, reject) => {
    db.findOne({autelId: userReq.autelId}, (err, user) => {
        if (err) {
            reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)});
            return;
        } else if (!user) {
            reject({
                err: `User ${userReq.autelId} does not exist!`,
                ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)
            });
            return;
        } else if (+user.validCode !== (+userReq.validCode)) {
            reject({
                err: `User ${userReq.autelId}. Incorrect verification code: ${userReq.validCode}! Expected: ${user.validCode}`,
                ...ResponseBuilder(null, Strings.Errors.wrongConfirmCode, Strings.Success.notSuccess)
            });
            return;
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
module.exports.loginCheck = loginCheck;
