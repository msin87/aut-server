const carsModel = require('../models/cars');
const logger = require('../logger/logger');
module.exports = {
    all: async (req, res) => {
        try {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Building new cars. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            const result = await carsModel.all(req.query);
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Send cars. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            logger.INFO(result.err);
            res.send(result);
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars is sent. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
        } catch (err) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars build error. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            logger.ERROR(err.message || err);
            res.send({data: null, errcode: 'S0001', success: 0});
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Cars error is sent. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
        }
    }
};