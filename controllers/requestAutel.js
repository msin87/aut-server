const carsController = require('./cars');
const usersController = require('./users');
const logger = require('../logger/logger');
module.exports = async (req, res) => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Request controller. IP:${req.headers['x-forwarded-for']}, REQUEST: ${JSON.stringify(req.query)}`);
    switch (+req.query['cmd']) {
        case 12101:     //request validation code
            usersController.reqValidCode(req, res);
            break;
        case 12102:     //confirm validation code. register new user
            await usersController.registerNewUser(req, res);
            break;
        case 12103:     //login
            await usersController.login(req, res);
            break;
        case 12106:
            await usersController.resetPassword(req, res);
            break;
        case 12203:
            // await usersController.bindSerialNumber(req, res);
            break;
        case 2502:
            usersController.softwareCheck(req, res);
            break;
        case 2504:
            await carsController.all(req, res);
            break;
        default: res.sendStatus(444);
    }
};