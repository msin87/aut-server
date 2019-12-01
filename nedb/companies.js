const nedbAsync = require('../nedb/asyncWrapper');
module.exports = nedbAsync({filename:'db/companies.db'});