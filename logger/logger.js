const winston = require('winston');
const LEVEL = Symbol.for('level');
const Settings = require('../settings');
const DailyRotateFile =require('winston-daily-rotate-file');
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
        new DailyRotateFile({filename: 'logs/%DATE%-error.log', level: 'ERROR', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('ERROR'))}),
        new DailyRotateFile({filename: 'logs/%DATE%-debug.log', level: 'DEBUG', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('DEBUG'))}),
        new DailyRotateFile({filename: 'logs/%DATE%-warning.log', level: 'WARNING', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('WARNING'))}),
        new DailyRotateFile({filename: 'logs/%DATE%-commands.log', level: 'COMMANDS', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('COMMANDS'))}),
        new DailyRotateFile({filename: 'logs/%DATE%-fileReqs.log', level: 'FILE_REQUEST', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('FILE_REQUEST'))}),
        new DailyRotateFile({filename: 'logs/%DATE%-info.log', level: 'INFO', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '1m', json: false, format: winston.format.combine(timeStampFormat,myFormat,formatOnlyLevel('INFO'))}),
        new winston.transports.Console({format: winston.format.combine(winston.format.colorize(),timeStampFormat,myFormat)})
    ],
    level: 'FILE_REQUEST'
});

logger.settings = {level: Settings.logger.level};
module.exports = logger;