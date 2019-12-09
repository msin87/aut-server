const Factory = require('../../../factory/react-admin/controller');
const controllers = dbNames =>
    dbNames.reduce((acc, dbName) =>
        Object.assign(acc, {[dbName]: Factory(require(`../../models/react-admin/${dbName}`))}, {}), {});
;
module.exports = controllers;