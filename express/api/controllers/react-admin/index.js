const Factory = require('../../../factory/react-admin/controller');
const controllers = dbNames =>
    (models =>
        dbNames.reduce((acc, dbName) =>
            Object.assign(acc, {[dbName]: Factory(models[dbName])}), Object.create(null)))
    (require(`../../models/react-admin`)(dbNames));


module.exports = controllers;