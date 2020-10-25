import socketClient from 'socket.io-client';
const serverAddr = window.location.hostname;
let serverPort = ":8080";

if(serverAddr.includes('nolife')){
    // Use default port in production
    serverPort = "";
}

const io = socketClient(serverAddr+serverPort, {
    path: '/wss',
    autoConnect: false,
});

io.on('connect', () => {
    console.log('Connection established');
});

io.on('torrent_load', data => {
    console.log(data);
});

io.on('new_user', data => {
    console.log(data);
});

function submit_torrent(magnetURI=''){
    console.log('Broadcasting torrent', magnetURI.slice(0, 20));
    io.emit('torrent_load', {
        room: 'waiting_room',
        type: "torrent_load",
        payload: magnetURI,
    });
}

function join_lobby(lobby_name="waiting_room", cb){
    console.log('Joining lobby', lobby_name);
    io.emit("subscribe", lobby_name);
}

function init_socket(cb){
    io.connect();
    io.on('message', cb);
    io.on('room_msg', cb);
}

export default {
    join_lobby,
    init_socket,
    submit_torrent,
}

