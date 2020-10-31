const express = require('express');
const app = express();
const http = require('http').createServer(app);
// const DHT = require('bittorrent-dht');
const Webtorrent = require('webtorrent-hybrid');
const Server = require('socket.io');
const fs = require('fs');
const Room = require('../models/Room');

const PORT = 8080;
const rooms = [];
let broadcaster;

const announceList = [
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz',
    'wss://video.blender.org:443/tracker/socket',
    'wss://tube.privacytools.io:443/tracker/socket',
    'wss://tracker.sloppyta.co:443/announce',
    'wss://tracker.lab.vvc.niif.hu:443/announce',
    'wss://tracker.files.fm:7073/announce',
    'wss://peertube.cpy.re:443/tracker/socket',
    'wss://open.tube:443/tracker/socket',
    'wss://hub.bugout.link:443/announce',
];

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

const io = new Server(http, {
    path: '/wss',
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.conn.id, socket.handshake.address);
    io.emit('new_user', "User connected:", socket.id);
    socket.send({
        type: 'init',
        payload: rooms,
    });

    /**
     * WebRTC Signalling Calls
     */
    socket.on("webrtc", (payload) => {
        switch(payload.type){
            case "broadcaster":
                console.log('Setting broadcaster', socket.id);
                broadcaster = socket.id;
                break;
            case "watcher":
                console.log('Adding watcher', socket.id);
                socket.to(broadcaster).emit("webrtc", {
                    type: payload.type,
                    id: socket.id,
                });
                break;
            case "offer":
                socket.to(payload.id).emit("webrtc", {
                    type: payload.type,
                    id: socket.id,
                    desc: payload.desc,
                });
                break;
            case "candidate":
                socket.to(payload.id).emit("webrtc", {
                    type: payload.type,
                    id: socket.id,
                    candidate: payload.candidate,
                });
                break;
            case "answer":
                socket.to(payload.id).emit("webrtc", {
                    type: payload.type,
                    id: socket.id,
                    desc: payload.desc,
                });
                break;
            default:
                console.log("No action taken", payload);
        }
    })
    socket.on('broadcaster', () => {
        broadcaster = socket.id;
    });

    socket.on('watcher', () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });

    socket.on('offer', (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });

    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });


    /**
     * Torrent Calls
     */
    socket.on('torrent_load', (data) => {
        console.log('room_msg:', data);
        // torrent_server.add(data.payload[0].magnetURI, torrent_added);

        create_room(data, socket);
        console.log('New rooms', rooms);

        io.to("waiting_room").emit("room_msg", data);
    });

    socket.on('video_state', (data) => {
        console.log('Video state update', data.room, data);
        io.to(data.room).emit("room_msg", data);
    })

    socket.on('subscribe', (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on('disconnect', (reason) => {
        if(broadcaster !== socket.id){
            socket.to(broadcaster).emit("disconnectPeer", socket.id);
        }

        console.log("Socket disconnected", reason);

        for(let i=0; i<rooms.length; i++){
            if(rooms[i] && rooms[i].owner === socket.conn.id){
                delete rooms[i];
                rooms.splice(i, 1);
                break;
            }
        }

        console.log('# of rooms:', rooms.length, rooms);
    });
});

function create_room(data, socket){
    let new_room = new Room(data.name, socket.conn.id, data.payload.torrentFile);
    rooms.push(new_room);
}

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

function remove_torrent_data(torrentID){
    try{
        const t = torrent_server.get(torrentID);
        if(t){
            fs.rmdir(t.path, { recursive: true }, (err) => {
                if(err){
                    console.error('Failed to remove file', err);
                }
            });
        }

        torrent_server.remove(torrentID);
    } catch(err){
        console.error("Failed to remove torrent", err);
    }
}