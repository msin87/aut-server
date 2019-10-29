const carsController = require('./cars');
const usersController = require('./users');

module.exports = async (req, res) => {
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
            await usersController.softwareCheck(req, res);
            break;
        case 2504:
            await carsController.all(req, res);
            break;
    }
};