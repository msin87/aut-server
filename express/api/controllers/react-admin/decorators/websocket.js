const ws = require('../../../../../websocket');
const webSocketSend = req =>
    ws.send(JSON.stringify({
        method: req.method,
        url: req.url,
        body: req.body,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(':')[3]
    }));

module.exports = webSocketSend;