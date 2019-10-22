const users = require('../models/users');
const Commands = {
    cmd12101: async (req,res) => {
        try {
            await users.create()
        }
    },
    cmd12103: async (req,res) => {
        const date = new Date();
        try {
            const user = await users.findByAutelId(req.query.autelId);
            console.log(user);
        } catch (e) {
            res.send(e);
        }

    },
    cmd2504: req => {

    }
};
const logConnection = req => console.log(`${Date()}\r\nIP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, cmd: ${req.query.cmd}`);


const CmdSwitch = async (req, res) => {
    logConnection(req);
    switch (+req.query['cmd']) {
        case 12103:
            await Commands.cmd12103(req,res);
            break;
        case 2504:

            break;
    }
};
module.exports = CmdSwitch;