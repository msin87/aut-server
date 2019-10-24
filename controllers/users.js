const users = require('../models/users');
const serials = require('../models/serials');
const Strings = require('../templates/strings');
const DateTime = require('../utils/dateTime');
const ResponseBuilder = require('../utils/responseBuilder');

module.exports = async (req, res) => {
    switch (+req.query['cmd']) {
        case 12101:     //request validation code
            res.send(users.validation());
            break;
        case 12102:     //confirm validation code. register new user
            try {
                await users.findById(req.query.autelId);

            } catch (e) {
                res.send(await users.create(req.query));
            }
            break;
        case 12103:     //login
            try {
                const result = await users.loginCheck(req.query);
                res.send(result)
            } catch (error) {
                res.send(error);
            }
            break;
        case 12203:     //bind serial number
            try {
                await serials.findBySerialNumber(req.query.sn);
                res.send(ResponseBuilder({
                    data: null,
                    errcode: Strings.Errors.serialHasBinded,
                    Success: Strings.Success.notSuccess
                }));
            }
            catch (e) {
                await serials.create({
                    sn: req.query.sn,
                    token: req.query.token,
                    regPwd: req.query.regPwd,
                    validDate: null
                });
                res.send(ResponseBuilder({
                    data: {
                        result: {
                            proTypeName: '',
                            proRegTime: DateTime.getCurrentDateTime(),
                            proSerialNo: req.query.sn
                        }
                    }, errcode: Strings.Errors.noError, success: Strings.Success.success
                }));
            }
            break;
        case 2504:
               //request marks
            break;

    }
};