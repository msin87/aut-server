const DataStore = require('nedb');
module.exports = settings => {
    const db = new DataStore({autoload: true, filename: settings['filename']});
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
        db.find(query['filter']).sort(query['sort']).skip(query['skip']).limit(query['limit']).exec((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            }
        )
    );
    const countAsync = (query = {}) => new Promise((resolve, reject) =>
        db.count(query, (err, count) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(count);
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
    const updateAsync = (query, update, options = {}) => new Promise((resolve, reject) => {
        db.update(query, update, options, (err, docs) => {
            if (err) {
                reject(err);
            } else {
                db.persistence.compactDatafile();
                resolve(docs)
            }
        })
    });
    const deleteAsync = (query, options) => new Promise(async (resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
            if (err) {
                reject(err);
            } else {
                db.persistence.compactDatafile();
                resolve(numRemoved)
            }
        })
    });
        return {insertAsync, findAsync, findOneAsync, updateAsync, deleteAsync, countAsync}
};