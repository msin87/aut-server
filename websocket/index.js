const WebSocket = require('ws');
const Socket = () => {
    const wss = new WebSocket.Server({port: 8084, host: '127.0.0.1'});
    let ws = null;
    wss.on('connection', socket =>
        ws = socket);
    wss.on('close', () =>
        delete (ws));
    return {
        send: data => wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    }
};
module.exports = Socket();