const Factory = require('../../../factory/react-admin/model');
const dbFactory = require('../../../../nedb/index');
const models = dbNames => {
    const db = dbFactory(dbNames);
    return dbNames.reduce((acc, dbName) =>
        Object.assign(acc, {[dbName]: Factory(db[dbName])}), Object.create(null));
};
module.exports = models;