module.exports = model => ({
    getList: async (req, res) => {
        let list = await model.getList({
            sort: [req.query._sort, req.query._order],
            range: [req.query._start, req.query._end],
            filter: ''
        });
        list.docs = list.docs.map(one => ({...one, id: one._id}));
        res.set('X-Total-Count', list.total);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(list.docs);
    },
    getOne: async (req, res) => {
        let one = await model.getOne(req.params);
        one['id'] = one['_id'];
        res.json(one);
    }
});