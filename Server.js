const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    console.log('Received message from client:', message);
  
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

function broadcast(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('message', (data) => {
  try {
    const command = JSON.parse(data);

    if (command.command === 'start' || 
        command.command === 'stop' || 
        command.command === 'speedup' || 
        command.command === 'slowdown' || 
        command.command === 'reverse') {
      broadcast(JSON.stringify(command)); 
    }
  } catch (error) {
    console.error("Error parsing command:", error);
  }
});

console.log('WebSocket server listening on port 8080');