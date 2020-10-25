const express = require('express');
const app = express();
const http = require('http').createServer(app);
// const DHT = require('bittorrent-dht');
const Webtorrent = require('webtorrent-hybrid');
const Server = require('socket.io');

const PORT = 8080;
const links = {};

/**
 * Setup Torrent server
 */
const torrent_server = new Webtorrent();
// const dht = new DHT()

// dht.listen(20000, function () {
//     console.log('DHT Listening')
// });

/**
 * Express server setup
 */
app.use(express.static('prod'));


/**
 * WebSocket server setup
 */

const io = new Server(http, {
    path: '/wss',
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.conn.id, socket.handshake.address);
    io.emit('new_user', "User connected:", socket.id);
    socket.send({
        type: 'init',
        payload: links,
    });

    console.log(socket.request.connection.remoteAddress, socket.request.connection.remotePort);

    socket.on('torrent_load', (data) => {
        console.log('room_msg:', data);
        links[socket.conn.id] = data.payload;
        torrent_server.add(Buffer.from(data.payload[0].torrentFile), torrent_added);

        io.to(data.room).emit("room_msg", data);
    });

    socket.on('subscribe', (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on('disconnect', (reason) => {
        console.log("Socket disconnected", reason);
        console.log(torrent_server.torrents);

        if(links[socket.conn.id]){
            torrent_server.remove(links[socket.conn.id][0].magnetURI);
            delete links[socket.conn.id];
        }
    });
});

http.listen(PORT, () => {
    console.log('App listening on:', PORT);
});

/**
 * Configure torrent server events
 */

torrent_server.on('torrent', (torrent) => {
    console.log('Torrent added', torrent.name);
});

function torrent_added(torrent){
    torrent.on('warning', (w) => console.log(`WARN: ${w}.`));
    torrent.on('error', (err) => console.log(`ERROR: ${err}.`));
    torrent.on('done', () => {
        console.log('Torrent download complete');
    });
}

// function addDhtNode(node){
//     dht.addNode(node);
// }