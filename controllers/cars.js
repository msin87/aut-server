const carsModel = require('../models/cars');
const logger =require('../logger/logger');
module.exports = {
    all: async (req, res) => {
        try {
            const result = await carsModel.all(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            console.log(err);
            res.send({data:null, errcode: 'S0001', success: 0});
        }
    }
};