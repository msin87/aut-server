const DataStore = require('nedb');
const Strings = require('../templates/strings');
const db = new DataStore({filename: 'db/serials.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});
const dbCb = (resolve, reject, err, docs, msgNotFound) => {
    if (err) {
        reject(err)
    } else if (!docs || docs.length === 0) {
        reject(msgNotFound)
    } else
        resolve(Strings.makeResponse({
            result: docs,
            errcode: Strings.Errors.noError,
            Success: Strings.Success.success
        }));
};
module.exports.all = () => new Promise((resolve, reject) =>
    db.find({}, (err, docs) =>
        dbCb(resolve, reject, err, docs, 'serials.db is empty!')));
module.exports.findById = id => new Promise((resolve, reject) =>
    db.findOne({_id: id}, (err, doc) =>
        dbCb(resolve, reject, err, doc, `_id: ${id} not found!`)));
module.exports.findByAutelId = autelId => new Promise((resolve, reject) =>
    db.find({autelId: autelId}, (err, docs) =>
        dbCb(resolve, reject, err, docs, {
            data: null,
            errcode: Strings.Errors.emailDoesNotExist,
            success: Strings.Success.notSuccess
        })));
module.exports.findBySerialNumber = sn => new Promise((resolve, reject) =>
    db.find({sn: sn}, (err, docs) =>
        dbCb(resolve, reject, err, docs, {
            data: null,
            errcode: Strings.Errors.serialDoesNotExist,
            success: Strings.Success.notSuccess
        })));
module.exports.findByToken = token => new Promise((resolve, reject) =>
    db.find({token: token}, (err, docs) =>
        dbCb(resolve, reject, err, docs, {
            data: null,
            errcode: Strings.Errors.serialDoesNotExist,
            success: Strings.Success.notSuccess
        })));
module.exports.create = sn => new Promise((resolve, reject) =>
    db.insert(sn, (err, docs) => {
        if (err) {
            console.log(`SerialNumber creating error: ${sn}`);
            reject(err);
        } else {
            resolve(docs);
        }
    }));
module.exports.updateSerialNumber = (snToUpdate, newSn) => new Promise((resolve, reject) =>
    db.update({sn: snToUpdate}, newSn, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber creating error: ${snToUpdate}`)));
module.exports.deleteSerialNumber = sn => new Promise((resolve, reject) =>
    db.remove({sn: sn}, {}, (err, docs) =>
        dbCb(resolve, reject, err, docs, `SerialNumber delete error: ${sn}`)));