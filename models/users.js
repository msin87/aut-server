const Strings = require('../templates/strings');
const Settings = require('../settings');
const ResponseBuilder = require('../utils/responseBuilder');
const UserBuilder = require('../utils/userBuilder');
const db = require('../db.js');
const Random = require('../utils/random');

const dbCb = (resolve, reject, err, docs, msgNotFound, doCleanData = false) => {
    if (err) {
        reject({error: err})
    } else if (!docs) {
        reject({error: msgNotFound})
    } else
        resolve(ResponseBuilder(doCleanData ? null : {result: docs}, Strings.Errors.noError, Strings.Success.success));
};
const insertUser = query => new Promise((resolve, reject) => {
    db.insert(UserBuilder.newUser(query), (err, docs) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({data: null, errcode: Strings.Errors.noError, success: Strings.Success.success})
    })
});

const getUser = user => new Promise((resolve, reject) => {
    db.findOne({autelId: user.autelId}, (err, doc) => {
        if (err) {
            reject(err);
            return
        }
        if (!doc) {
            resolve({data: null, state: Strings.UserState.notExist});
            return;
        }
        if (!doc['validDate'] || !doc['allowed']) {
            resolve({data: doc, state: Strings.UserState.notAllowed});
            return;
        }
        if (user.pwd && (doc.pwd !== user.pwd)) {
            resolve({data: doc, state: Strings.UserState.wrongPassword});
            return;
        }
        if (Date.parse(doc['validDate']) < Date.now()) {
            resolve({data: doc, state: Strings.UserState.expired});
            return;
        }
        resolve({data: doc, state: Strings.UserState.ok});
    })
});
const loginCheck = async user => {
    const foundUser = await getUser(user);
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
    }
};

module.exports.all = () => new Promise((resolve, reject) =>
    db.find({}, (err, docs) =>
        dbCb(resolve, reject, err, docs, 'user.db is empty!')));

module.exports.getUser = getUser;

module.exports.findById = id => new Promise((resolve, reject) =>
    db.findOne({_id: id}, (err, doc) =>
        dbCb(resolve, reject, err, doc, `_id: ${id} not found!`)));

module.exports.findByAutelId = autelId => new Promise((resolve, reject) =>
    db.findOne({autelId: autelId}, (err, doc) =>
        dbCb(resolve, reject, err, doc, {
            err: `User ${autelId} does not exist!`,
            ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)
        })));

module.exports.create = async query => {
    const foundUser = await getUser(query);
    if (foundUser.state === Strings.UserState.notExist) {
        if (+query.validCode === +Settings.passwords.registerUser) {
            return await insertUser(query);
        } else {
            return {err: `User ${query.autelId} registration failed. Wrong verification code ${query.validCode}! Expected: ${Settings.passwords.registerUser}`, data: null, errcode: Strings.Errors.wrongConfirmCode, success: Strings.Success.notSuccess}
        }
    }
    else{
        return {err: `User ${query.autelId} registration failed. User already exists!`,data: null, errcode: Strings.Errors.accountHasExist, success: Strings.Success.notSuccess}
    }
    // db.insert(UserBuilder.newUser(query), (err, docs) =>
    //     dbCb(resolve, reject, err, docs, `User creating error: ${query}`, true))
};


module.exports.updateUser = (userToUpdate, newUser) => new Promise((resolve, reject) =>
    db.update({autelId: userToUpdate}, newUser, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber creating error: ${userToUpdate}`)));

module.exports.deleteUser = user => new Promise((resolve, reject) =>
    db.remove({autelId: user}, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${user}`)));

module.exports.validation = () => ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success);


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
                resolve(ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success))
            })
        }
    })
});
module.exports.loginCheck = loginCheck;
