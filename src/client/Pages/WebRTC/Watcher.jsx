import React, { Component } from 'react';
import socketapi from '../../api/socket';

const config = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"]
        }
    ]
}

export default class Streamer extends Component {
    constructor(props){
        super();

        this.state = {
            peerConnection: new RTCPeerConnection(config),
            mediaConstrains: {
                video: { facingMode: "user" },
                audio: true,
            },
        }

        this.load_video = this.load_video.bind(this);
        this.on_offer = this.on_offer.bind(this);
        this.on_candidate = this.on_candidate.bind(this);
        this.handle_socket = this.handle_socket.bind(this);
        this.socket_connect = this.socket_connect.bind(this);
    }

    componentDidMount(){
    }

    socket_connect(type){
        socketapi.init_webrtc(type, this.handle_socket);
    }

    handle_socket(msg){
        console.log('Socket msg', msg);
        switch(msg.type){
            case "offer":
                console.log("Got Offer", msg);
                this.on_offer(msg);
                break;
            case "candidate":
                console.log("Got Candidate", msg);
                this.on_candidate(msg);
                break;
        }
    }

    on_offer(data){
        const {id, desc} = data;
        // peerConnection = new RTCPeerConnection(config);
        this.state.peerConnection
            .setRemoteDescription(desc)
            .then(() => this.state.peerConnection.createAnswer())
            .then(sdp => this.state.peerConnection.setLocalDescription(sdp))
            .then(() => {
                socketapi.emit_webrtc({
                    type: "answer",
                    id,
                    desc: this.state.peerConnection.localDescription,
                })
            });

            this.state.peerConnection.ontrack = event => {
                try{
                    console.log('Got track', event);
                    console.log('Streams', event.streams);

                    const video = document.getElementById("video");
                    video.srcObject = event.streams[0];
                    // video.play();
                } catch(err){
                    console.error(err);
                }
            };

            this.state.peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socketapi.emit_webrtc({
                        type: "candidate",
                        id,
                        candidate: event.candidate,
                    })
                } else {
                    console.warn('No event candidate', event);
                }
            };
    }

    on_candidate(data){
        const {id, candidate} = data;

        this.state.peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    }

    load_video(){
        const files = document.getElementById('file_input').files;
        const file = files[0];

        console.log(file);
        const video_url = URL.createObjectURL(file);
        this.set_video_src(video_url);
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.socket_connect("broadcaster")}>Broadcaster</button>
                    <button onClick={() => this.socket_connect("watcher")}>Watcher</button>
                </div>
                <div>
                    <div>
                        <video id="video" playsInline muted controls={false} crossOrigin="anonymous"/>
                    </div>
                </div>
            </div>
        )
    }
}
