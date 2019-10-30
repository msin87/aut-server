const users = require('../models/users');
// const logger =require('../logger/logger');
module.exports = {
    reqValidCode: (req, res) => res.send(users.validation()),
    registerNewUser: async (req, res) => {
        try {
            const result = await users.create(req.query);
            console.log(result.err);
            res.send(result);
        } catch (err) {
            console.log(err.err);
            res.send({data:null, errcode: 'S0001', success: 0});
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
