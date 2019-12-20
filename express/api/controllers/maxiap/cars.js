const carsModel = require('../../models/maxi-ap/cars');
const logger = require('../../../../logger/logger');
const clientsDb = require('../react-admin')(['clients']);
// const user = await Users.getUser({autelId: {$regex: regExp}});
module.exports = {
    all: async (req, res) => {
        try {
            switch (parseInt(req.query.sys)){
                case 0:
                    req.query.sys=64;
                    break;
                case 2:
                    req.query.sys=32;
                    break;
            }
            let Cars = await carsModel(req.query);
            Cars = Cars.all().insertUserData().result();
            logger.INFO(Cars.err);
            res.send(Cars);
        } catch (err) {
            logger.ERROR(err.message || err);
            res.send({data: null, errcode: 'S0001', success: 0});
        }
    }
};