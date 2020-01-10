const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8084});
let ws;
wss.on('connection',socket=>ws=socket);
wss.on('close',()=>delete(ws));
module.exports = ws;