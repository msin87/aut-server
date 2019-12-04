const express = require('express');
const DecoderMiddleWare = require('../../../../utils/encryptDecrypt').decoder;
const carsController = require('../../controllers/maxiap/cars');
const usersController = require('../../controllers/maxiap/AutelStore_users');
const router = express.Router();
const routeParser = async (req, res) => {
    switch (+req.query['cmd']) {
        case 12101:     //request validation code
            usersController.reqValidCode(req, res);
            break;
        case 12102:     //confirm validation code. register new user
            await req.sendStatus(404);
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
        case 2503:
            await usersController.serverCheck(req,res);
            break;
        default: res.sendStatus(444);
    }
};
router.post('/AutelStore.fcgi', DecoderMiddleWare, express.query(), routeParser);
module.exports = router;
