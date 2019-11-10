const db = (require('../db.js')).db;
const backupDb = (require('../db.js')).backupDb;
const Settings = require('../settings');
const logger = require('../logger/logger');
const HOUR = 60 * 60 * 1000;
backupDb.loadDatabase(err => {
    if (err) console.log(err);
});
const insertUser = (dataBase, user) => new Promise((resolve, reject) =>
    dataBase.insert(user, (err, docs) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(docs);
    })
);
const getAllUsers = dataBase => new Promise((resolve, reject) =>
    dataBase.find({}, (err, docs) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(docs)
    })
);
const deleteUser = (dataBase, autelId) => new Promise((resolve, reject) =>
    dataBase.remove({autelId: autelId}, {}, (err, docs) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(docs);
        }
    ));


const Cleaner = () => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase cleaner. Enter`);
    const watcher = () => {
        logger.INFO('Cleaner started!');
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase cleaner. Watcher started`);
        getAllUsers(db).then(async (users) => {
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase caner. getAllUsers callback`);
            let changed = false;
            for (let user of users) {
                if (Date.parse(user.validDate + 'T23:59:59') < Date.now()) {
                    logger.INFO(`Cleaner: remove expired user ${user['autelId']}`);
                    await deleteUser(db, user['autelId']);
                    user = {...user, allowed: false};
                    await insertUser(backupDb, user);
                    changed = true;
                }
            }
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase cleaner. Users cleaning complete`);
            if (changed) {
                db.persistence.compactDatafile();
                backupDb.persistence.compactDatafile();
                if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase cleaner. Compact database`);
            }
            logger.INFO('Cleaner finished!');
            if (logger.settings.level === 'DEBUG') logger.DEBUG(`DataBase cleaner. Finished`);
        })
    };
    return {
        start: () => {
            if (this.timer) {
                clearInterval(this.timer);
            }
            watcher();
            this.timer = setInterval(watcher, Settings.cleaner.hours * HOUR );
        },
        stop: () => {
            clearInterval(this.timer);
        }
    }
};
module.exports = Cleaner();