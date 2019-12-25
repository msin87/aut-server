const users = require('../../models/maxi-ap/clients');
const logger = require('../../../../logger/logger');
const serverCheck = require('../../../../responses/2503');
module.exports = {
    reqValidCode: (req, res) => res.send(users.validCode()),
    login: async (req, res) => {
        try {
            const result = await users.loginCheck(req.query);
            logger.INFO(result.err);
            if (result.banned) {
                res.setHeader('banned', req.query.autelId);
            }
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err || err);
            res.send({data: null, errcode: 'S0001', success: 0});
        }
    },
    resetPassword: async (req, res) => {
        try {
            const result = await users.resetPassword(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err);
            res.send(err);
        }
    },
    softwareCheck: (req, res) => {
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. Before send softwareCheck response. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
        res.send({data: null, errcode: '24', success: '0'});
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. After send softwareCheck response. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
    },
    serverCheck: async (req, res) => {
        res.send(JSON.stringify(serverCheck));
        logger.INFO(`CMD2503. ServerCheck. IP: ${req.headers['x-forwarded-for']}`);
    },
};