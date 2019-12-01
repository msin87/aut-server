const DB_PATH=process.cwd()+'/nedb/clients';
const Factory = require('../factory/react-admin/model');
const model = Factory(DB_PATH);

module.exports = model;