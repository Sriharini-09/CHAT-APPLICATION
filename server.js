const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newuser', (username) => {
        console.log(`${username} joined`);
        socket.broadcast.emit('update', `${username} joined the conversation`);
    });

    socket.on('chat', (message) => {
        console.log('Received chat message:', message);
        socket.broadcast.emit('chat', message);
    });

    socket.on('exituser', (username) => {
        console.log(`${username} left`);
        socket.broadcast.emit('update', `${username} left the conversation`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
