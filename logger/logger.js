const winston = require('winston');
const LEVEL = Symbol.for('level');
const Settings = require('../settings');
const config = {
    levels: {
        ERROR: 0,
        WARNING: 1,
        INFO: 2,
        COMMAND: 3,
        FILE_REQUEST: 4,
        DEBUG: 5,

    },
    colors: {
        ERROR: 'red',
        DEBUG: 'blue',
        WARNING: 'yellow',
        INFO: 'green',
        COMMAND: 'cyan',
        FILE_REQUEST: 'grey'
    }
};
winston.addColors(config.colors);
const myFormat = winston.format.printf(({level,message,timestamp})=>{
    return `${timestamp} [${level}]: ${message}`
});
const formatOnlyLevel = level => winston.format(info=>info[LEVEL]===level?info:false)();
const timeStampFormat= winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
});
const logger = winston.createLogger({
    levels: config.levels,
    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'ERROR', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('ERROR'))}),
        new winston.transports.File({filename: 'logs/debug.log', level: 'DEBUG', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('DEBUG'))}),
        new winston.transports.File({filename: 'logs/warnings.log', level: 'WARNING', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('WARNING'))}),
        new winston.transports.File({filename: 'logs/commands.log', level: 'COMMAND', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('COMMAND'))}),
        new winston.transports.File({filename: 'logs/fileReqs.log', level: 'FILE_REQUEST', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('FILE_REQUEST'))}),
        new winston.transports.File({filename: 'logs/info.log', level: 'INFO', format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('INFO'))}),
        new winston.transports.Console({format: winston.format.combine(winston.format.colorize(),timeStampFormat,myFormat)})
    ],
    level: 'FILE_REQUEST'
});
logger.settings = {level: Settings.logger.level};
module.exports = logger;