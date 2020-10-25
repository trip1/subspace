const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = 8080;

const links = {};

/**
 * Express server setup
 */
app.use(express.static('dist'));


/**
 * WebSocket  server setup
 */
const Server = require('socket.io');
const io = new Server(http, {
    path: '/wss',
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.conn.id);
    io.emit('new_user', "User connected:", socket.id);
    socket.send({
        type: 'init',
        payload: links,
    });

    socket.on('torrent_load', (data) => {
        console.log('room_msg:', data);
        
        if(links[socket.conn.id]){
            links[socket.conn.id].push(data.payload);
        } else {
            links[socket.conn.id] = [data.payload];
        }
        
        io.to(data.room).emit("room_msg", data);
    });

    socket.on('subscribe', (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on('disconnect', (reason) => {
        console.log("Socket disconnected", reason);
        if(links[socket.conn.id]){
            delete links[socket.conn.id];
        }
    });
});

http.listen(PORT, () => {
    console.log('App listening on:', PORT);
});