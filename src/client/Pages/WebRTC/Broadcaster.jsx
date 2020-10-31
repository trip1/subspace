import React, { Component } from 'react';
import socketapi from '../../api/socket';

export default class Broadcaster extends Component {
    constructor(props){
        super();

        this.state = {
            peerConnections: {},
            peerconn: {},
            mediaConstrains: {
                video: { facingMode: "user" },
                audio: true,
            },
            config: {
                iceServers: [
                    {
                        urls: ["stun:stun.l.google.com:19302"]
                    }
                ]
            }
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
        console.log('Socket msg', msg);
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
        const conn = new RTCPeerConnection(this.state.config);
        const peerConnections = Object.assign({}, this.state.peerConnections);
        peerConnections[id] = conn;

        const video1 = document.getElementById("video1");
        const stream = video1.captureStream();

        stream.getTracks().forEach(track => conn.addTrack(track, stream));

        conn.onicecandidate = event => {
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
        
        conn
        .createOffer()
        .then(sdp => conn.setLocalDescription(sdp))
        .then(() => {
            socketapi.emit_webrtc({
                type: "offer",
                id,
                desc: conn.localDescription,
            })
        });

        this.setState({
            peerConnections,
        })
    }

    on_answer(data){
        const {id, desc} = data;
        const peerConnections = Object.assign({}, this.state.peerConnections);
        peerConnections[id].setRemoteDescription(desc);

        this.setState({
            peerConnections
        });
    }

    on_candidate(data){
        const {id, candidate} = data;
        const peerConnections = Object.assign({}, this.state.peerConnections);

        if(peerConnections[id]){
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));

            this.setState({
                peerConnections
            });
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
    }

    set_video_src(src){
        document.getElementById('video1').setAttribute('src', src);
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
                        <input id="file_input" onChange={this.load_video} type="file" accept="video/*"></input>
                    </div>
                    <div>
                        <video id="video1" muted controls={true} crossOrigin="anonymous"/>
                    </div>
                </div>
            </div>
        )
    }
}
