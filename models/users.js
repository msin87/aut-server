const DataStore = require('nedb');
const Strings = require('../templates/strings');
const ResponseBuilder = require('../utils/responseBuilder');
const UserBuilder = require('../utils/userBuilder');
const db = new DataStore({filename: 'db/users.db'});
const CarsBuilder = require('../utils/carsBuilder');
const Random = require('../utils/random');
db.loadDatabase(err => {
    if (err) console.log(err);
});
const dbCb = (resolve, reject, err, docs, msgNotFound, doCleanData = false) => {
    if (err) {
        reject({error: err})
    } else if (!docs) {
        reject({error: msgNotFound})
    } else
        resolve(ResponseBuilder(doCleanData ? null : {result: docs}, Strings.Errors.noError, Strings.Success.success));
};
const loginCheck = user => new Promise((resolve, reject) => {
    db.findOne({autelId: user.autelId}, (err, doc) => {
        if (err) {
            console.log(err);
            reject({
                err,
                ...ResponseBuilder(null, Strings.Errors.communicationFailed, Strings.Success.notSuccess)
            });
        } else if (!doc) {
            reject({
                err: `User ${user.autelId} does not exist!`,
                ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)
            });
        } else if (doc.pwd !== user.pwd) {
            reject({
                err: `User ${user.autelId}. Wrong password!`,
                ...ResponseBuilder(null, Strings.Errors.wrongPassword, Strings.Success.notSuccess)
            });
        } else if (Date.parse(doc['validDate']) < Date.now()) {
            reject({
                err: `User ${user.autelId}. Expired date! `,
                ...ResponseBuilder(null,Strings.Errors.dataError,Strings.Success.notSuccess)
            })
        } else {
            resolve(ResponseBuilder(doc, Strings.Errors.noError, Strings.Success.success));
        }
    })
});

const getAppPlatform = query => {
    switch (JSON.stringify(query).indexOf('"sn"')) {
        case 1:
            return Strings.AppPlatform.android32;
        case 10:
            return Strings.AppPlatform.iOS;
        case 75:
            return Strings.AppPlatform.android64;
    }
};


module.exports.all = () => new Promise((resolve, reject) =>
    db.find({}, (err, docs) =>
        dbCb(resolve, reject, err, docs, 'user.db is empty!')));

module.exports.findById = id => new Promise((resolve, reject) =>
    db.findOne({_id: id}, (err, doc) =>
        dbCb(resolve, reject, err, doc, `_id: ${id} not found!`)));

module.exports.findByAutelId = autelId => new Promise((resolve, reject) =>
    db.findOne({autelId: autelId}, (err, doc) =>
        dbCb(resolve, reject, err, doc, {
            err: `User ${autelId} does not exist!`,
            ...ResponseBuilder(null, Strings.Errors.emailDoesNotExist, Strings.Success.notSuccess)
        })));

module.exports.create = query => new Promise((resolve, reject) =>
    db.insert(UserBuilder.newUser(query), (err, docs) =>
        dbCb(resolve, reject, err, docs, `User creating error: ${query}`, true)));

module.exports.updateUser = (userToUpdate, newUser) => new Promise((resolve, reject) =>
    db.update({autelId: userToUpdate}, newUser, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber creating error: ${userToUpdate}`)));

module.exports.deleteUser = user => new Promise((resolve, reject) =>
    db.remove({autelId: user}, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${user}`)));

module.exports.validation = () => ResponseBuilder(null, Strings.Errors.noError, Strings.Success.success);

module.exports.getAllCars = query => new Promise((resolve, reject) => {
    if (!query.sn) {
        reject({
            err: `Missing serial number in request`,
            ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)
        });
        return;
    }
    db.findOne({serialNo: query.sn}, (err, user) => {
            if (err || !user["allowed"]) {
                reject({
                    err: err || `User ${query.sn} is now allowed!`,
                    ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)
                });
                return;
            }
            if (!user) {
                reject({
                    err: `User ${query.sn} does not exist!`,
                    ...ResponseBuilder(null, Strings.Errors.serialDoesNotExist, Strings.Success.notSuccess)
                });
                return;
            } else {
                CarsBuilder(user, getAppPlatform(query))
                    .then(Cars => resolve(ResponseBuilder(Cars, Strings.Errors.noError, Strings.Success.success)))
                    .catch(err => reject({err, ...ResponseBuilder(null, Strings.Errors.dataError, Strings.Success.notSuccess)}))
            }
        }
    )
});
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
module.exports.loginCheck = async user => await loginCheck(user);
