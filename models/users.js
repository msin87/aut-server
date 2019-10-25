const DataStore = require('nedb');
const Strings = require('../templates/strings');
const ResponseBuilder = require('../utils/responseBuilder');
const UserBuilder = require('../utils/userBuilder');
const db = new DataStore({filename: 'db/users.db'});
const CarsBuilder = require('../utils/carsBuilder');
db.loadDatabase(err => {
    if (err) console.log(err);
});
const dbCb = (resolve, reject, err, docs, msgNotFound) => {
    if (err) {
        reject({error: err})
    } else if (!docs) {
        reject({error: msgNotFound})
    } else
        resolve(ResponseBuilder({
            data: {result: docs},
            errcode: Strings.Errors.noError,
            success: Strings.Success.success
        }));
};
const loginCheck = user => new Promise((resolve, reject) => {
    db.findOne({autelId: user.autelId}, (err, doc) => {
        if (err) {
            console.log(err);
            reject({
                err,
                ...ResponseBuilder({
                    data: null,
                    errcode: Strings.Errors.communicationFailed,
                    success: Strings.Success.notSuccess
                })
            });
        } else if (!doc) {
            reject({
                err: `User ${user.autelId} does not exist!`,
                ...ResponseBuilder({
                    data: null,
                    errcode: Strings.Errors.emailDoesNotExist,
                    success: Strings.Success.notSuccess
                })
            });
        } else if (doc.pwd !== user.pwd) {
            reject({
                err: `User ${user.autelId}. Wrong password`,
                ...ResponseBuilder({
                    data: null,
                    errcode: Strings.Errors.wrongPassword,
                    Success: Strings.Success.notSuccess
                })
            });
        } else {
            resolve(ResponseBuilder({
                data: {result: doc},
                errcode: Strings.Errors.noError,
                success: Strings.Success.success
            }));
        }
    })
});


module.exports.all = () => new Promise((resolve, reject) =>
    db.find({}, (err, docs) =>
        dbCb(resolve, reject, err, docs, 'user.db is empty!')));

module.exports.findById = id => new Promise((resolve, reject) =>
    db.findOne({_id: id}, (err, doc) =>
        dbCb(resolve, reject, err, doc, `_id: ${id} not found!`)));

module.exports.findByAutelId = autelId => new Promise((resolve, reject) =>
    db.findOne({autelId: autelId}, (err, doc) =>
        dbCb(resolve, reject, err, doc, ResponseBuilder({
            err: `User ${autelId} does not exist!`,
            data: null,
            errcode: Strings.Errors.emailDoesNotExist,
            success: Strings.Success.notSuccess
        }))));

module.exports.create = query => new Promise((resolve, reject) =>
    db.insert(UserBuilder.newUser(query), (err, docs) =>
        dbCb(resolve, reject, err, docs, `User creating error: ${query}`)));

module.exports.updateUser = (userToUpdate, newUser) => new Promise((resolve, reject) =>
    db.update({autelId: userToUpdate}, newUser, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber creating error: ${userToUpdate}`)));

module.exports.deleteUser = user => new Promise((resolve, reject) =>
    db.remove({autelId: user}, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${user}`)));

module.exports.validation = () => ResponseBuilder({
    data: null,
    errcode: Strings.Errors.noError,
    success: Strings.Success.success
});

module.exports.getAllCars = query => new Promise((resolve, reject) => {
    if (!query.sn) {
        reject({
            err: `Missing serial number in request`,
            ...ResponseBuilder({
                data: null,
                errcode: Strings.Errors.dataError,
                success: Strings.Success.notSuccess
            })
        });
        return;
    }
    db.findOne({serialNo: query.sn}, (err, user) => {
            if (err) {
                reject({
                    err, ...ResponseBuilder({
                        data: null,
                        errcode: Strings.Errors.dataError,
                        success: Strings.Success.notSuccess,
                    })
                });
                return;
            } else if (!user) {
                reject({
                    err: `User ${query.sn} does not exist!`,
                    ...ResponseBuilder({
                        data: null,
                        errcode: Strings.Errors.serialDoesNotExist,
                        success: Strings.Success.notSuccess
                    })
                });
                return;
            } else {
                CarsBuilder(user).then(Cars => resolve(ResponseBuilder({
                    data: {result: Cars},
                    errcode: Strings.Errors.noError,
                    success: Strings.Success.success
                }))).catch(err => reject({
                        err,
                        ...ResponseBuilder({
                            data: null,
                            errcode: Strings.Errors.dataError,
                            success: Strings.Success.notSuccess
                        })
                    })
                )

            }
        }
    )
});
module.exports.loginCheck = async user => await loginCheck(user);
