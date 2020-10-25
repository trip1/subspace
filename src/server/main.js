const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Tracker = require('bittorrent-tracker').Server;

const PORT = 8080;
const TRACKERPORT = 8000;

const links = {};

/**
 * Express server setup
 */
app.use(express.static('dist'));


/**
 * WebSocket server setup
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


/**
 * Bittorrent Tracker setup
 */
const trackerserver = new Tracker({
    udp: false,
    http: true, // enable http server? [default=true]
    ws: true, // enable websocket server? [default=true]
    stats: true, // enable web-based statistics? [default=true]
});

trackerserver.listen(TRACKERPORT, 'tracker.nolife.best', () => {
    console.log('Tracker server startup complete', TRACKERPORT);
});

trackerserver.on('error', function (err) {
    // fatal trackerserver error!
    console.log(err.message);
})
  
trackerserver.on('warning', function (err) {
    // client sent bad data. probably not a problem, just a buggy client.
    console.log(err.message);
})
  
trackerserver.on('listening', function () {
    // fired when all requested trackerservers are listening
    console.log('listening on http port:' + trackerserver.http.address().port);
})

trackerserver.on('start', (addr) => {
    console.log('got start message from ' + addr)
})