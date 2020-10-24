const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = 8080;

/**
 * Express server setup
 */
app.use(express.static('dist'));


/**
 * WebSocket  server setup
 */
const Server = require('socket.io');
const io = new Server(http, {
    origins: '*:*',
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.conn.id);
    io.emit('new_user', "User connected:", socket.id);

    socket.on('torrent_load', (data) => {
        console.log('room_msg:', data);
        io.to(data.room).emit("room_msg", data);
    });

    socket.on('subscribe', (data) => {
        console.log(data);
        socket.join(data);
    })
});

http.listen(PORT, () => {
    console.log('App listening on:', PORT);
});