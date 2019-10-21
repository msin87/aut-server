const Datastore = require('nedb');
const db = new Datastore({filename: 'db/database.db'});
db.loadDatabase(err => {
    console.log(err);
});
db.asyncFindOne = query => new Promise((resolve, reject) => {
    db.findOne(query, (err, docs) => {
        if (err) {
            reject(err)
        } else if (!docs) {
            reject('Wrong autelId or password')
        }
        else {
            resolve(docs);
        }

    })
});

const Commands = {
    cmd12103: async req => {
        const date = new Date();
        try {
            const user = await db.asyncFindOne({autelId: req.query['autelId'], pwd: req.query['pwd']});
            console.log(user);
        }
        catch (e) {
            console.log(e);
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
            await Commands.cmd12103(req);
            break;
        case 2504:

            break;
    }
};
module.exports = CmdSwitch;