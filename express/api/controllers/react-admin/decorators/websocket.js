const ws = require(__dirname + '/websocket');
const decorateList =
    {
        clients: ['create', 'update', 'delete'],
        admins: ['create', 'update', 'delete'],
        companies: ['create', 'update', 'delete'],
        cars: ['create', 'update', 'delete']
    };
const wrapper = (dbName,methods) => {
    const originMethods = Object.assign(methods,null);
    if (decorateList.hasOwnProperty(dbName)){

    }
}
module.exports = wrapper;