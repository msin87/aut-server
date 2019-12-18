const nedbAsync = require('../nedb/asyncWrapper');
const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');
const memoize = fn => {
    const cache = Object.create(null);
    return (...args) => {
        const key = generateKey(args);
        const val = cache[key];
        if (val) return val;
        const res = fn(...args);
        cache[key] = res;
        return res;
    };
};
const memoized = memoize(nedbAsync);
module.exports = dbNames => {
    let db = Object.create(null);
    for (let dbName of dbNames) {
          Object.assign(db,memoized(dbName)) ;
    }
    return db;
};

