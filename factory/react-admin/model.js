module.exports = dbPath => {
    if (process.platform === "win32")
        dbPath = dbPath.replace(/\//g, '\\');
    const db = require(dbPath);
    return {
        getList: async ({sort = ['id', 1], range = [], filter = {}}) => {
            if (sort[0] === 'id') sort[0] = '_id';
            let docs = await db.findAsync({
                filter,
                sort: {[sort[0]]: sort[1] === 'ASC' ? 1 : -1},
                skip: range[0],
                limit: (range[1])
            });
            let total = await db.countAsync();
            return {docs, total};
        },
        getOne: async query => {
            if (query.hasOwnProperty('id'))
                return await db.findOneAsync({_id: query.id});
            return await db.findOneAsync(query)
        }
    }
};