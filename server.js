const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const rooms = {}; // { roomName: { white: socketId, black: socketId } }

io.on('connection', (socket) => {
    console.log('User  connected:', socket.id);

    socket.on('create', (data) => {
        const { room } = data;
        if (rooms[room]) {
            socket.emit('error', 'Room already exists');
        } else {
            rooms[room] = { white: socket.id, black: null };
            socket.join(room);
            socket.emit('joined', { room, color: 'white' });
        }
    });

    socket.on('join', (data) => {
        const { room } = data;
        if (!
