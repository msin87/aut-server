module.exports.passwords = {registerUser: '456321', banUser: '987123'};
module.exports.ip = {
    soft: '92.119.113.136:8080',
    logos: '92.119.113.136:8080',
    lgPack: '92.119.113.136:8080',
    store: 'http://store.auteltech.net:8082/AutelStore.fcgi'
};
module.exports.demo = {
    hours: 48
};
module.exports.cleaner = {
    hours: 24
};
// noinspection PointlessArithmeticExpressionJS
module.exports.firewall = {
    banTime: 1 * 60 * 60 * 1000,
    toleranceTime: 10 * 1000,
    filterWidth: 5,
    ruleName: 'AutelBan',
    outDateTime: 1 * 60 * 60 * 1000
};
module.exports.logger = {
    level: 'DEBUG'
};