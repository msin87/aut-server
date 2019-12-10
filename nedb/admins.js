const nedbAsync = require('../nedb/asyncWrapper');
const test = require('./index')(['admins', 'cars', 'clients', 'companies', 'firewall']);
module.exports = nedbAsync({filename:'db/admins.db'});
