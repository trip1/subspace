const express = require('express');
const app = express();
const http = require('http').createServer(app);
const DHT = require('bittorrent-dht');
const Webtorrent = require('webtorrent-hybrid');

const PORT = 80;
const DHTPORT = 20000;

const links = {};

/**
 * Setup Torrent server
 */
const torrent_server = new Webtorrent();

/**
 * Express server setup
 */
app.use(express.static('prod'));


/**
 * WebSocket server setup
 */
const Server = require('socket.io');
const webtorrentHybrid = require('webtorrent-hybrid');
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

        // torrent_server.add(data.payload[0].magnetURI, torrent_added);

        io.to(data.room).emit("room_msg", data);
    });

    socket.on('subscribe', (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on('disconnect', (reason) => {
        console.log("Socket disconnected", reason);
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
 * Bittorrent DHT setup
 */
const dht = new DHT();

dht.listen(DHTPORT, function () {
    console.log('DHT Now Listening', DHTPORT)
});

dht.on('peer', function (peer, infoHash, from) {
    console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
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
    })
}