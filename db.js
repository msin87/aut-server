const DataStore = require('nedb');
const db = new DataStore({filename: 'db/users.db'});
db.loadDatabase(err => {
    if (err) console.log(err);
});
module.exports=db;