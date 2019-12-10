const strToBool = require('../../../utils/strToBool');
const buildFilter = query => {
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
    return Object.keys(query).map(key => {
        switch (key) {
            case 'autelId':
                return {autelId: RegExp(query[key] || '')};
            case 'banned':
                return {banned: strToBool(query[key])};
            case 'demoMsu':
                return {demoMsu: strToBool(query[key]) ? RegExp('msu') : ''};
            default:
                break;
        }
    }).reduce((acc, val) => {
        return Object.assign(acc, val);
    }, {});
};
module.exports = model => ({
    getList: async (req, res) => {

        const list = await model.getList({
            sort: [req.query._sort, req.query._order],
            range: [req.query._start, req.query._end],
            filter: buildFilter(req.query)
        });
        res.set('X-Total-Count', list.total);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(list.docs);
    },
    getOne: async (req, res) => {
        let result = await model.getOne(req.params);
        res.json(result);
    },
    create: async (req, res) => {
        try {
            await model.create({...req.body, ...req.params});
            res.sendStatus(200);
        } catch {
            res.sendStatus(500);
        }
    },
    update: async (req, res) => {
        try {
            const result = await model.update({...req.body, ...req.params});
            res.json(result);
        } catch {
            res.sendStatus(500);
        }
    },
    delete: async (req, res) => {
        try {
            const result = await model.delete(req.params);
            res.json(result);
        } catch {
            res.sendStatus(500);
        }
    },
});