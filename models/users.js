const ERROR_NO = 'S0000';
const ERROR_EMAIL = 'S0002';
const SUCCESS = 1;
const DataStore = require('nedb');
const db = new DataStore({filename: 'db/users.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});

const makeResponse = (data, errcode, success) => ({
    data: data,
    errcode: errcode,
    success: success,
});
const dbCb = (resolve, reject, err, docs, msgNotFound) => {
    if (err) {
        reject(err)
    } else if (!docs) {
        reject(msgNotFound)
    } else
        resolve(makeResponse({result:docs},ERROR_NO, SUCCESS));
};

module.exports.all = () => new Promise((resolve, reject) =>
    db.find({}, (err, docs) =>
        dbCb(resolve, reject, err, docs, 'user.db is empty!')));
module.exports.findById = id => new Promise((resolve, reject) =>
    db.findOne({_id: id}, (err, doc) =>
        dbCb(resolve, reject, err, doc, `_id: ${id} not found!`)));
module.exports.findByAutelId = autelId => new Promise((resolve, reject) =>
    db.findOne({autelId: autelId}, (err, doc) =>
        dbCb(resolve, reject, err, doc, {data: null, errcode: 'S0002', success: 0})));
module.exports.create = user => new Promise((resolve, reject) =>
    db.insert(user, (err, docs) =>
        dbCb(resolve, reject, err, docs, `user creating error: ${user}`)));
module.exports.validation = () => makeResponse(null, ERROR_NO, SUCCESS);

