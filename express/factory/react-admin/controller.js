module.exports = model => ({
    getList: async (req, res) => {

        let list = await model.getList({
            sort: [req.query._sort, req.query._order],
            range: [req.query._start, req.query._end],
            filter: ''
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
        try{
            await model.create({...req.body, ...req.params});
            res.sendStatus(200);
        }
        catch {
            res.sendStatus(500);
        }
    },
    update: async (req, res) => {
        try {
            const result = await model.update({...req.body, ...req.params});
            res.json(result);
        }
        catch {
            res.sendStatus(500);
        }
    },
    delete: async (req, res) => {
        try{
            await model.delete(req.params);
            res.sendStatus(200);
        }
        catch {
            res.sendStatus(500);
        }
    },
});