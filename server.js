/* eslint "no-undef":"off" */
/* eslint "no-console":"off" */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import five from 'johnny-five';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 3000;
const board = new five.Board();

server.listen(PORT);
console.log('Server is running');

const connections = [];

io.on('connection', (socket) => {
  connections.push(socket);
  console.log(`${connections.length} sockets is connecteds`);

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
  });
  
  board.on('ready', () => {
    const led = new five.Led(13);
    socket.on('turn on', (message) => { 
      led.stop();
      led.on();
    });
    socket.on('turn off', (message) => { 
      led.stop();
      led.off();
    });
    socket.on('blink', (time) => { led.blink(time) });
  })

});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

