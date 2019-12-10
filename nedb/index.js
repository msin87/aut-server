const nedbAsync = require('../nedb/asyncWrapper');
module.exports = dbNames => dbNames.reduce((acc,val)=>Object.assign(acc,{[val]:nedbAsync({filename:`db/${val}.db`})}),{});

