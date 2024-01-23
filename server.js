import WebSocket, { WebSocketServer } from 'ws';

console.log("THis is the port: ", process.env.PORT)
const wss = new WebSocketServer({port: Number(process.env.PORT)});

let pastorData = { type: "NONE", date: new Date() };

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    const Jdata = JSON.parse(data);
    pastorData = {type: Jdata.type, time: new Date(Jdata.time)}
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  // Send the initial data to the user
    ws.send(JSON.stringify(pastorData))
});
