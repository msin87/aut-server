const users = require('../models/users');
const logger = require('../logger/logger');
const serverCheck = require('../responses/2503');
module.exports = {
    reqValidCode: (req, res) => res.send(users.validation()),
    registerNewUser: async (req, res) => {
        try {
            const result = await users.create(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            if (err.err.indexOf('BANNED') >= 0) {
                logger.INFO(err.err);
            } else {
                logger.ERROR(err.err);
            }
            res.send({data: null, errcode: 'S0001', success: 0});
        }
    },
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
        const found = await users.all(req.query);
        res.send(found.data.result);
    },
};