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
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. Start login check. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            const result = await users.loginCheck(req.query);
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. End login check. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            logger.INFO(result.err);
            if (result.banned) {
                res.setHeader('banned', req.query.autelId);
            }
            res.send(result);
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. Login check result is sent. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
        } catch (err) {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. User check error. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
            logger.ERROR(err.err || err);
            res.send({data: null, errcode: 'S0001', success: 0});
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. User error is sent. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
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
    // bindSerialNumber: async (req, res) => {
    // },
    softwareCheck: (req, res) => {
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. Before send softwareCheck response. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
        res.send({data: null, errcode: '24', success: '0'});
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`Users controller. After send softwareCheck response. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
    },
    getAll: async (req, res) => {
        const found = await users.all(req.query);
        logger.INFO(found.err);
        res.send(found.data.result);
    },
    serverCheck: async (req, res) => {
        res.send(JSON.stringify(serverCheck));
        logger.INFO(`CMD2503. ServerCheck. IP: ${req.headers['x-forwarded-for']}`);
        const found = await users.all(req.query);
        res.send(found.data.result);
    },
    getByQuery: async (req, res) => {
        const found = await users.findByQuery({[req.query.key]: req.query.value});
        if (found.data) {
            res.send(found.data.result)
        } else {
            res.send(null)
        }
    },
    update: async (req, res) => {
        try {
            const result = await users.updateUserProperty(req.query.autelId, {
                key: req.query.property,
                value: req.query.value
            });
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err);
            res.send(err);
        }
    },
    setNewValidDate: async (req, res) => {
        try {
            const result = await users.setNewValidDate(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err);
            res.send(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const result = await users.deleteUser(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err);
            res.send(err);
        }
    },
    addUser: async (req, res) => {
        try {
            const result = await users.addUser(req.query);
            logger.INFO(result.err);
            res.send(result);
        } catch (err) {
            logger.ERROR(err.err);
            res.send(err);
        }
    }
};