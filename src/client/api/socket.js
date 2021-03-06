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

function submit_torrent(room, data=''){
    console.log('Broadcasting torrent', data.infoHash);

    io.emit('torrent_load', {
        name: room,
        payload: data,
        type: "torrent_load",
    });
}

function video_state(data){
    io.emit('video_state', data);
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

function init_webrtc(user_type, cb){
    io.connect();
    io.emit(user_type);

    io.on("webrtc", cb);
}

function emit_webrtc(data){
    console.log("Sending", data.type);
    io.emit("webrtc", data);
}

export default {
    join_lobby,
    init_socket,
    video_state,
    submit_torrent,
    init_webrtc,
    emit_webrtc,
}

