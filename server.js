import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

function heartbeat() {
  console.log("ping recieved");
  this.isAlive = true;
}

let pastorData = { type: "NONE", time: new Date() };

wss.on("connection", function connection(ws) {
  ws.isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", heartbeat);

  ws.on("message", function message(data, isBinary) {
    const Jdata = JSON.parse(data);
    pastorData = { type: Jdata.type, time: new Date(Jdata.time) };
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  // Send the initial data to the user
  ws.send(JSON.stringify(pastorData));
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", function close() {
  clearInterval(interval);
});
