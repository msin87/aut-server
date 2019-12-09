const DB_WRAPPER_PATH = process.cwd() + '/nedb/';
const Factory = require('../../../factory/react-admin/model');
const models = dbNames =>
    dbNames.reduce((acc, dbName) =>
        Object.assign(acc, {[dbName]: Factory(DB_WRAPPER_PATH + dbName)}, {}), {});
module.exports = models;