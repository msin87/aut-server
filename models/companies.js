const DB_PATH=process.cwd()+'/nedb/companies';
const Factory = require('../factory/react-admin/model');
const model = Factory(DB_PATH);

module.exports = model;