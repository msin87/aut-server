const users = require('../models/users');
const serials = require('../models/serials');
const Strings = require('../templates/strings');
const userTemplate = ' {\n' +
    '             "actCode" : "",\n' +
    '             "actState" : 1,\n' +
    '             "address" : "",\n' +
    '             "answer" : "",\n' +
    '             "appPlatform" : "",\n' +
    '             "autelId" : "bovalehe@umail365.com",\n' +
    '             "city" : "",\n' +
    '             "code" : "cui20191022193427029533c374",\n' +
    '             "comUsername" : "",\n' +
    '             "company" : "",\n' +
    '             "country" : "",\n' +
    '             "daytimePhone" : "",\n' +
    '             "daytimePhoneAC" : "",\n' +
    '             "daytimePhoneCC" : "",\n' +
    '             "daytimePhoneExtCode" : "",\n' +
    '             "firstName" : "",\n' +
    '             "id" : "123" ,\n' +
    '             "imageUrl_key" : "https://pro.autel.com",\n' +
    '             "imageUrl_mall" : "https://pro.autel.com",\n' +
    '             "imageUrl_maxiap" : "https://pro.autel.com",\n' +
    '             "isAllowSendEmail" : 1,\n' +
    '             "languageCode" : "lag201304221104540500",\n' +
    '             "lastLoginTime" : "",\n' +
    '             "lastName" : "",\n' +
    '             "middleName" : "",\n' +
    '             "minSaleUnitCode" : "",\n' +
    '             "mobilePhone" : "",\n' +
    '             "mobilePhoneAC" : "",\n' +
    '             "mobilePhoneCC" : "",\n' +
    '             "name" : "",\n' +
    '             "province" : "",\n' +
    '             "questionCode" : "",\n' +
    '             "regTime" : "",\n' +
    '             "secondActState" : -2,\n' +
    '             "secondEmail" : "",\n' +
    '             "sendActiveTime" : "",\n' +
    '             "sendResetPasswordTime" : "",\n' +
    '             "sendSecondEmailActiveTime" : "",\n' +
    '             "serialNo" : "",\n' +
    '             "sourceType" : -2,\n' +
    '             "token" : "",\n' +
    '             "tokenCreateTime" : "",\n' +
    '             "tokenCreateTime_maxiap" : "",\n' +
    '             "token_maxiap" : "zE0a7qRuPXdUJy98oQsBgD0+RT0",\n' +
    '             "userPwd" : "",\n' +
    '             "zipCode" : ""\n' +
    '          }\n';
const user = JSON.parse(userTemplate);

const getCurrentDateTime = () => {
    const date = new Date();
    return date.toLocaleDateString() + ' ' + ('0' + date.toLocaleTimeString()).slice(-8);
};
const Commands = {
    cmd12101: async (req, res) => { //request validation code
        res.send(users.validation());
    },
    cmd12102: async (req, res) => { //validation confirmation and new user create
        try {
            user.autelId = req.query.autelId;
            user.pwd = req.query.pwd;
            user.lastLoginTime = getCurrentDateTime();
            user.regTime = getCurrentDateTime();
            user.tokenCreateTime_maxiap = getCurrentDateTime();
            user.token_maxiap = req.query.autelId;
            const newUser = await users.create(user);
            res.send(newUser);
        } catch (e) {
            console.log(e);
        }
    },
    cmd12103: async (req, res) => { //check password, login.
        try {
            const result = await users.loginCheck(req.query);
            res.send(result)
        } catch (error) {
            res.send(error);
        }

    },
    cmd12203: async (req,res) => {
        try {
            const newSerial =await serials.findBySerialNumber(req.query.sn);
            res.send(Strings.makeResponse({data: null, errcode: Strings.Errors.serialHasBinded, Success: Strings.Success.notSuccess }));
        }
        catch (e) {
            await serials.create({sn:req.query.sn,token:req.query.token,regPwd:req.query.regPwd, validDate: null});
            res.send(Strings.makeResponse({data: {result: {proTypeName:'',proRegTime:getCurrentDateTime(),proSerialNo:req.query.sn}}, errcode: Strings.Errors.noError, success: Strings.Success.success}));
        }
    },
    cmd2504: async (req, res) => {

    }
};

const CmdSwitch = async (req, res) => {
    switch (+req.query['cmd']) {
        case 12101:
            Commands.cmd12101(req, res);    //request validation code
            break;
        case 12102:
            Commands.cmd12102(req, res);    //confirm validation code. register new user
            break;
        case 12103:
            await Commands.cmd12103(req, res);  //login
            break;
        case 12203:
            await Commands.cmd12203(req, res);  //bind serial number
            break;
        case 2504:
            await Commands.cmd2504(req, res);   //request marks
            break;

    }
};
module.exports = CmdSwitch;