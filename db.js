const DataStore = require('nedb');
const db = new DataStore({filename: 'db/users.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});
const insertAsync = query => new Promise((resolve, reject) => {
    db.insert(query, (err, newDoc) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(newDoc)
    })
});
const findAsync = query => new Promise((resolve, reject) =>
    db.find(query, (err, docs) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(docs);
        }
    )
);
const findOneAsync = query => new Promise((resolve, reject) =>
    db.findOne(query, (err, doc) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(doc);
        }
    )
);
const updateAsync = (query, update, options={}) => new Promise((resolve, reject) => {
    db.update(query, update, options, (err, docs) => {
        if (err) {
            reject(err);
        } else {
            db.persistence.compactDatafile();
            resolve(docs)
        }
    })
});
const deleteAsync = (query,options) => new Promise(async (resolve, reject) => {
    db.remove(query, options, (err, numRemoved) => {
        if (err) {
            reject(err);
        } else {
            db.persistence.compactDatafile();
            resolve(numRemoved)
        }
    })
});

module.exports = {insertAsync,findAsync,findOneAsync,updateAsync,deleteAsync};