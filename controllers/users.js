const users = require('../models/users');

module.exports = {
    reqValidCode: (req, res) => res.send(users.validation()),
    registerNewUser: async (req, res) => {
        try {
            await users.findById(req.query.autelId);
        } catch (err) {
            const result = await users.create(req.query);
            res.send(result);
        }
    },
    login: async (req, res) => {
        try {
            const result = await users.loginCheck(req.query);
            console.log(result.err);
            res.send(result);
        } catch (err) {
            console.log(err.err);
            res.send({data:null, errcode: 'S0001', success: 0});
        }
    },
    resetPassword: async (req, res) => {
        try {
            const result = await users.resetPassword(req.query);
            res.send(result);
        } catch (err) {
            console.log(err.err);
            res.send(err);
        }
    },
    // bindSerialNumber: async (req, res) => {
    // },
    softwareCheck: async (req, res) => res.send({data: null, errcode: '24', success: '0'})
};
