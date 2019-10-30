const winston = require('winston');
const config = {
    levels: {
        ERROR: 0,
        DEBUG: 1,
        WARNING: 2,
        COMMAND: 3,
        FILE_REQUEST: 4
    },
    colors: {
        ERROR: 'red',
        DEBUG: 'blue',
        WARNING: 'yellow',
        COMMAND: 'cyan',
        FILE_REQUEST: 'grey'
    }
};
winston.addColors(config.colors);
const logger = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'ERROR'}),
        new winston.transports.File({filename: 'logs/debug.log', level: 'DEBUG'}),
        new winston.transports.File({filename: 'logs/warnings.log', level: 'WARNING'}),
        new winston.transports.File({filename: 'logs/commands.log', level: 'COMMAND'}),
        new winston.transports.File({filename: 'logs/fileReqs.log', level: 'FILE_REQUEST'}),
        new winston.transports.Console()
    ],
    level: 'COMMAND'
});
logger.ERROR('err');
logger.WARNING('warn');
logger.DEBUG('DEBUG');
logger.COMMAND('COMMAND');
logger.FILE_REQUEST('FILE_REQUEST');