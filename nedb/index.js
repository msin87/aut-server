const nedbAsync = require('../nedb/asyncWrapper');
const db = dbNames => {
    this.dbNames = dbNames.filter(name => !(this.dbNames ? this.dbNames.includes(name) : false));
    this.result = Object.assign(this.result || Object.create(null),
        dbNames.reduce((acc, val) => {
            const res = Object.assign(acc, {[val]: nedbAsync({filename: `db/${val}.db`})})
            return res;
        }, Object.create(null)));
    return this.result;
};


module.exports = db;

