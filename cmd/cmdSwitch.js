const users = require('../models/users');
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
    '             "token_maxiap" : "8jqZS6LTlP6RaDAG/sYVstL5DLs",\n' +
    '             "userPwd" : "",\n' +
    '             "zipCode" : ""\n' +
    '          }\n';
const user = JSON.parse(userTemplate);
const getCurrentDateTime = () => {
    const date = new Date();
    return date.toLocaleDateString() + ' ' + ('0' + date.toLocaleTimeString()).slice(-8);
}
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
    cmd2504: async (req, res) => {

    }
};
const logConnection = req => console.log(`${Date()}\r\nIP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, cmd: ${req.query.cmd}`);


const CmdSwitch = async (req, res) => {
    logConnection(req);
    switch (+req.query['cmd']) {
        case 12101:
            Commands.cmd12101(req, res);
            break;
        case 12102:
            Commands.cmd12102(req, res);
            break;
        case 12103:
            await Commands.cmd12103(req, res);
            break;
        case 2504:
            await Commands.cmd2504(req, res);
            break;

    }
};
module.exports = CmdSwitch;