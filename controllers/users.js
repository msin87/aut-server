const users = require('../models/users');

module.exports = async (req, res) => {
    switch (+req.query['cmd']) {
        case 12101:     //request validation code
            res.send(users.validation());
            break;
        case 12102:     //confirm validation code. register new user
            try {
                await users.findById(req.query.autelId);
            } catch (err) {
                const result = await users.create(req.query);
                res.send(result);
            }
            break;
        case 12103:     //login
            try {
                const result = await users.loginCheck(req.query);
                res.send(result)
            } catch (err) {
                console.log(err.err);
                res.send(err);
            }
            break;
        case 12106:
            try{
                const result = await users.resetPassword(req.query);
                res.send(result);
            }
            catch (err) {
                console.log(err.err);
                res.send(err);
            }
            break;

        case 12203:     //bind serial number
            // try {
            //     await serials.findBySerialNumber(req.query.sn);
            //     res.send(ResponseBuilder({
            //         data: null,
            //         errcode: Strings.Errors.serialHasBinded,
            //         Success: Strings.Success.notSuccess
            //     }));
            // }
            // catch (e) {
            //     await serials.create({
            //         sn: req.query.sn,
            //         token: req.query.token,
            //         regPwd: req.query.regPwd,
            //         validDate: null
            //     });
            //     res.send(ResponseBuilder({
            //         data: {
            //             result: {
            //                 proTypeName: '',
            //                 proRegTime: DateTime.getCurrentDateTime(),
            //                 proSerialNo: req.query.sn
            //             }
            //         }, errcode: Strings.Errors.noError, success: Strings.Success.success
            //     }));
            // }
            break;
        case 2504:
               try{
                   res.send(await users.getAllCars(req.query))
               }
               catch (err) {
                   console.log(err.err);
                   res.send(err);
               }
            break;
        case 2502:
            res.send({data:null,errcode:'24',success:'0'});

    }
};