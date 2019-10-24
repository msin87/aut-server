
const DataStore = require('nedb');
const Strings = require('../templates/strings');
const db = new DataStore({filename: 'db/users.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});


const dbCb = (resolve, reject, err, docs, msgNotFound) => {
    if (err) {
        reject(err)
    } else if (!docs) {
        reject(msgNotFound)
    } else
        resolve(Strings.makeResponse({result: docs, errcode: Strings.Errors.noError, success: Strings.Success.success}));
};
const loginCheck = user => new Promise((resolve, reject) => {
    db.findOne({autelId: user.autelId}, (err, doc) => {
        if (err) {
            console.log(err);
            reject(Strings.makeResponse({data: null, errcode: Strings.Errors.communicationFailed, success: Strings.Success.notSuccess}));
        } else if (!doc) {
            reject(Strings.makeResponse({data: null, errcode: Strings.Errors.emailDoesNotExist, success: Strings.Success.notSuccess}));
        } else if (doc.pwd !== user.pwd) {
            reject(Strings.makeResponse({data: null, errcode: Strings.Errors.wrongPassword, Success: Strings.Success.notSuccess}));
        } else {
            resolve(Strings.makeResponse({data: {result: doc}, errcode: Strings.Errors.noError, success: Strings.Success.success}));
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
        dbCb(resolve, reject, err, doc, {data: null, errcode: Strings.Errors.emailDoesNotExist, success: Strings.Success.notSuccess})));
module.exports.create = user => new Promise((resolve, reject) =>
    db.insert(user, (err, docs) =>
        dbCb(resolve, reject, err, docs, `user creating error: ${user}`)));
module.exports.updateUser = (userToUpdate, newUser) => new Promise((resolve, reject) =>
    db.update({autelId:userToUpdate}, newUser,{},(err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber creating error: ${userToUpdate}`)));
module.exports.deleteUser = user => new Promise((resolve, reject) =>
    db.remove({autelId:user}, {},(err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${user}`)));
module.exports.validation = () => Strings.makeResponse({data: null, errcode: Strings.Errors.noError, success: Strings.Success.success});
module.exports.loginCheck = async user => await loginCheck(user);
