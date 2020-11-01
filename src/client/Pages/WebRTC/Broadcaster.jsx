import React, { Component } from 'react';
import socketapi from '../../api/socket';

const config = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ]
        },
        {
            urls: [
                "stun:nolife.best",
            ],
        },
        { 
            "urls": "turn:nolife.best",
            "username": "trip",
            "credential": "AuiYEMTavdao7T9Q2wS2dABf"
        }
    ]
}

const peerConnections = {};

export default class Broadcaster extends Component {
    constructor(props){
        super();

        this.state = {
            peerconn: {},
            mediaConstrains: {
                video: { facingMode: "user" },
                audio: true,
            },
        }

        this.load_video = this.load_video.bind(this);
        this.on_answer = this.on_answer.bind(this);
        this.on_candidate = this.on_candidate.bind(this);
        this.handle_socket = this.handle_socket.bind(this);
        this.set_video_src = this.set_video_src.bind(this);
        this.socket_connect = this.socket_connect.bind(this);
        this.establish_watcher_conn = this.establish_watcher_conn.bind(this);
    }

    componentDidMount(){
    }

    socket_connect(type){
        socketapi.init_webrtc(type, this.handle_socket);
    }

    handle_socket(msg){
        // console.log('Socket msg', msg);
        switch(msg.type){
            case "watcher":
                console.log("Added watcher", msg.id);
                this.establish_watcher_conn(msg.id);
                break;
            case "answer":
                console.log("Got Answer", msg);
                this.on_answer(msg);
                break;
            case "candidate":
                console.log("Got Candidate", msg);
                this.on_candidate(msg);
                break;
        }
    }

    establish_watcher_conn(id){
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;

        const video = document.getElementById("video");
        const stream = video.captureStream();

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        
        console.log(peerConnection.localDescription);
        
        peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socketapi.emit_webrtc({
                type: "offer",
                id,
                desc: peerConnection.localDescription,
            })
        });

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socketapi.emit_webrtc({
                    type: "candidate",
                    id,
                    candidate: event.candidate,
                })
            } else {
                console.log('No event candidate');
            }
        };
    }

    on_answer(data){
        const {id, desc} = data;
        peerConnections[id].setRemoteDescription(desc);
    }

    on_candidate(data){
        const {id, candidate} = data;

        if(peerConnections[id]){
            if(candidate){
                console.log('Candidate is good', candidate);
                peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                console.warn("Candidate is null", candidate);
            }
        } else {
            console.log('No peer conn found', peerConnections);
        }
    }

    load_video(){
        const files = document.getElementById('file_input').files;
        const file = files[0];

        console.log(file);
        const video_url = URL.createObjectURL(file);
        this.set_video_src(video_url);

        this.socket_connect("broadcaster");
    }

    set_video_src(src){
        document.getElementById('video').setAttribute('src', src);
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <input id="file_input" onChange={this.load_video} type="file" accept="video/*"></input>
                    </div>
                    <div>
                        <video id="video" muted controls={true} crossOrigin="anonymous"/>
                    </div>
                </div>
            </div>
        )
    }
}
