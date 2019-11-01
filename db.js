const DataStore = require('nedb');
const db = new DataStore({filename: 'db/users.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});
const backupDb = new DataStore({filename: 'db/old_users.db'});
backupDb.loadDatabase(err => {
    if (err) console.log(err);
});
module.exports.db=db;
module.exports.backupDb=backupDb;