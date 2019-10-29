const carsModel = require('../models/cars');
module.exports = {
    all: async (req, res) => {
        try {
            const result = await carsModel.all(req.query);
            console.log(result.err);
            res.send(result);
        } catch (err) {
            console.log(err);
            res.send({data:null, errcode: 'S0001', success: 0});
        }
    }
};