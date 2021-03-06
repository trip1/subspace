import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import Card from '../../Components/Containers/Card';
import StatsCard from '../../Components/StatsCard';
import SimplePeer from 'simple-peer';
import randstring from 'randomstring';
import socketapi from '../../api/socket';
import './torrent.css';

const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
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

export default class Torrent extends Component {
    constructor(props){
        super();

        this.state = {
            client: new WebTorrent({
                tracker: {
                    rtcConfig: {
                        ...SimplePeer.config,
                    }
                },
            }),
            wire: null,
            torrent: null,
            is_downloading: false,
            is_loaded: false,
            download_progress: 0,
            upload_count: 0,
            show_stats: true,
            client_logs: [],
            torrent_logs: [],
            wire_logs: [],
            server_torrents: [],
            show_logs: false,
            room: "",
            is_viewer: false,
            is_streamer: false,
        }

        this.on_play = this.on_play.bind(this);
        this.on_pause = this.on_pause.bind(this);
        this.wire_logs = this.wire_logs.bind(this);
        this.new_client = this.new_client.bind(this);
        this.client_logs = this.client_logs.bind(this);
        this.handle_wire = this.handle_wire.bind(this);
        this.upload_file = this.upload_file.bind(this);
        this.get_timecode = this.get_timecode.bind(this);
        this.torrent_logs = this.torrent_logs.bind(this);
        this.load_torrent = this.load_torrent.bind(this);
        this.update_state = this.update_state.bind(this);
        this.handle_socket = this.handle_socket.bind(this);
        this.stats_container = this.stats_container.bind(this);
        this.upload_torrent = this.upload_torrent.bind(this);
        this.append_wire_log = this.append_wire_log.bind(this);
        this.render_progress = this.render_progress.bind(this);
        this.show_stat_cards = this.show_stat_cards.bind(this);
        this.found_new_torrent = this.found_new_torrent.bind(this);
        this.append_client_log = this.append_client_log.bind(this);
        this.append_torrent_log = this.append_torrent_log.bind(this);
        this.update_video_state = this.update_video_state.bind(this);
        this.torrent_downloading = this.torrent_downloading.bind(this);
        this.render_video_player = this.render_video_player.bind(this);
        this.upload_torrent_fields = this.upload_torrent_fields.bind(this);
        this.render_server_torrents = this.render_server_torrents.bind(this);
        this.download_torrent_fields = this.download_torrent_fields.bind(this);
        this.upload_torrent_file_fields = this.upload_torrent_file_fields.bind(this);
    }

    new_client(){
        let client = new WebTorrent({
            tracker: {
                rtcConfig: {
                    ...SimplePeer.config,
                }
            },
        });

        client.on('warning', (warn) => this.append_client_log(`WARN: ${warn}`));
        client.on('error', (err) => this.append_client_log(`ERROR: ${err}`));
        console.log('Client ready');

        return client;
    }

    componentDidMount(){
        socketapi.init_socket(this.handle_socket);
        socketapi.join_lobby("waiting_room", this.handle_socket);

        this.state.client.on('warn', (w) => this.append_client_log(`WARN: ${w}`));
        this.state.client.on('error', (e) => this.append_client_log(`ERROR: ${e}`));

        const player = document.getElementById('player');
        player.addEventListener('play', this.on_play);
        player.addEventListener('pause', this.on_pause);
    }

    on_play(){
        console.log('Playing!');
        socketapi.video_state({
            room: this.state.room,
            status: 'play',
            timestamp: this.get_timecode(),
            type: "video_state",
        });
    }

    on_pause(){
        console.log('Paused!');
        socketapi.video_state({
            room: this.state.room,
            status: 'pause',
            timestamp: this.get_timecode(),
            type: "video_state",
        });
    }

    get_timecode(){
       return document.getElementById('player').currentTime;
    }

    handle_socket(msg){
        console.log('Socket message', msg);
        switch(msg.type){
            case "init":
                const rooms = [];
                for(let i in msg.payload){
                    rooms.push(msg.payload[i]);
                }

                console.log('rooms', rooms);
                if(rooms.length > 0){
                    this.found_new_torrent(rooms, true);
                }
                break;
            case "torrent_load":
                this.found_new_torrent(msg, false);
                break;
            case "video_state":
                this.update_video_state(msg);
                break;
            default:
                console.log("Socket event not handled", msg);
        }
    }

    update_video_state(data){
        const player = document.getElementById('player');

        switch(data.status){
            case "play":
                player.play();
                break;
            case "pause":
                player.pause();
                break;
        }

        player.currentTime = data.timestamp;
    }

    found_new_torrent(data, init=false){
        console.log('Found new torrents', data);
        const existing = [].concat(this.state.server_torrents);

        if(init){
            data.forEach(d => {
                existing.push({name: d.name, buff: Buffer.from(d.torrentFile)});    
            })
        } else {
            existing.push({name: data.name, buff: Buffer.from(data.payload.torrentFile)});
        }

        this.setState({
            server_torrents: existing,
        });
    }

    render_server_torrents(){
        if(this.state.server_torrents.length > 0){
            const t = [];
            this.state.server_torrents.forEach((tor, index) => {
                t.push(<div onClick={() => this.load_torrent(tor)} key={`server_torrent_${index}`}>
                    <Card>
                        {tor.name}
                    </Card>
                </div>);
            });

            return (
                <div>
                    {t}
                </div>
            )
        }

        return null;
    }

    load_torrent(tor){
        console.log(tor);
        // If nothing is passed in, check the input field
        let magnet_link = tor.buff;

        if(!magnet_link){
            magnet_link = tor.torrData.magnetURI;
        }

        if(!magnet_link){
            magnet_link = document.getElementById('magnet_link_input').value.trim();
        }

        // If nothing is in input field, load default test
        if(!magnet_link || magnet_link === ""){
            magnet_link = torrentId;
        }

        socketapi.join_lobby(tor.name, this.handle_socket);

        setInterval(this.update_state, 250);
        this.append_torrent_log('Adding torrent');
        console.log('Loading file', magnet_link);

        const torrent = this.state.client.add(magnet_link);
        // this.append_torrent_log(magnet_link);

        torrent.on('ready', () => {
            this.append_torrent_log('Torrent Ready!');
            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4');
            });

            this.setState({
                torrent,
                is_viewer: true,
                is_downloading: true,
            })
    
            // file.appendTo('body');
            file.renderTo('video#player');
        });

        torrent.on('done', () => {
            this.append_torrent_log('Torrent done');
            this.setState({
                is_loaded: true,
                is_downloading: false,
            })
        });

        torrent.on('warning', (w) => this.append_torrent_log(`WARN: ${w}.`));
        torrent.on('error', (err) => this.append_torrent_log(`ERROR: ${err}.`));
        torrent.on('infoHash', () => this.append_torrent_log('Hash Determined.'));
        torrent.on('metadata', () => this.append_torrent_log('Metadata Determined.'));
        torrent.on('noPeers', () => this.append_torrent_log('No Peers'));
        torrent.on('wire', this.handle_wire);
    }

    upload_file(){
        const file = document.getElementById('file_upload').files[0];
        const room = document.getElementById('room_name').value;

        setInterval(this.update_state, 250);

        this.state.client.seed(file, {
            announce: announceList,
            name: randstring.generate() + ".mp4",
        }, torrent => {
            console.log(torrent);
            torrent.on('infoHash', () => this.append_torrent_log('Hash Determined.'));
            torrent.on('metadata', () => this.append_torrent_log('Metadata Determined.'));
            torrent.on('ready', () => this.append_torrent_log('Torrent Ready.'));
            torrent.on('warning', (w) => this.append_torrent_log(`WARN: ${w}.`));
            torrent.on('error', (err) => this.append_torrent_log(`ERROR: ${err}.`));
            torrent.on('wire', this.handle_wire);

            this.setState({
                room,
                is_streamer: true,
                is_loaded: true,
                is_downloading: false,
                torrent,
            });

            socketapi.submit_torrent(room, {
                infoHash: torrent.infoHash,
                magnetURI: torrent.magnetURI,
                torrentFile: torrent.torrentFile,
            });

            this.append_torrent_log(torrent.magnetURI);

            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4');
            });

            if(file){
                file.renderTo('video#player');
            }
        })
    }

    upload_torrent(){
        const torrentFile = document.getElementById('torrent_file').files[0];
        const room = document.getElementById('room_name').value;

        const torrent = this.state.client.add(torrentFile);

        setInterval(this.update_state, 250);
        this.append_torrent_log('Adding torrent');
        console.log('Loading file', torrent);

        this.setState({
            torrent,
            room,
            is_streamer: true,
            is_loaded: true,
            is_downloading: false,
        });

        socketapi.submit_torrent(room, {
            infoHash: torrent.infoHash,
            magnetURI: torrent.magnetURI,
            torrentFile: torrent.torrentFile,
        });

        torrent.on('done', () => {
            this.append_torrent_log('Torrent done');
            this.setState({
                is_loaded: true,
                is_downloading: false,
            })
        });

        torrent.on('warning', (w) => this.append_torrent_log(`WARN: ${w}.`));
        torrent.on('error', (err) => this.append_torrent_log(`ERROR: ${err}.`));
        torrent.on('infoHash', () => this.append_torrent_log('Hash Determined.'));
        torrent.on('metadata', () => this.append_torrent_log('Metadata Determined.'));
        torrent.on('noPeers', () => this.append_torrent_log('No Peers'));
        torrent.on('wire', this.handle_wire);
    }

    handle_wire(wire){
        this.setState({
            wire
        });

        wire.on('port', port => {
            if (!wire.remoteAddress) {
                return this._debug('ignoring PORT from peer with no address')
            }

            console.log(wire.remoteAddress, port);
            this.state.client.dht.addNode({ host: wire.remoteAddress, port })
        })

        wire.on('handshake', (infoHash, peerId, extensions) => {
            console.log('Handshake from', peerId);
            console.log(extensions.dht) // supports DHT (BEP-0005)
            console.log(extensions.extended) // supports extension protocol (BEP-0010)
        });

        wire.on('choke', () => {
            console.log('Peer is choking us');
            this.append_wire_log('Peer is choking us');
        });

        wire.on('unchoke', () => {
            console.log('Peer is no longer choking us');
            this.append_wire_log('Peer is no longer choking us');
        });

        wire.on('interested', () => {
            // peer is now interested
            console.log('Peer is interested');
            this.append_wire_log('Peer is interested');
        });

        wire.on('uninterested', () => {
            // peer is no longer interested
            console.log('Peer is uninterested');
            this.append_wire_log('Peer is uninterested');
        });
    }

    update_state(){
        if(this.state.torrent && this.state.torrent.progress){
            this.setState({
                download_progress: this.state.torrent.progress,
                upload_count: this.state.torrent.uploaded,
            });
        }
    }

    torrent_downloading(bytes, torrent){
        console.log('Downloading:', bytes, 'Progress:', (torrent.progress * 100).toFixed(0));
        this.setState({
            download_progress: torrent.progress
        });
    }

    torrent_uploading(bytes, torrent){
        console.log('Uploading:', bytes, 'Total:', (torrent.progress * 100).toFixed(0));
        this.setState({
            download_progress: torrent.progress
        });
    }

    render_progress(){
        if(this.state.is_downloading && !this.state.is_loaded){
            return (
                <div className="progress_container">
                    <progress className="progress_bar" value={this.state.torrent.progress}></progress>
                </div>
            )
        }

        return null;
    }

    show_stat_cards(){
        if((this.state.is_downloading || this.state.is_loaded) && this.state.show_stats && this.state.is_streamer){
            return (
                <div className="full_width flex space-around">
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Ratio' data={(this.state.torrent.ratio).toFixed(2)} />
                    </div>
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Time Left' data={(this.state.torrent.timeRemaining / 1000).toFixed(0)} />
                    </div>
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Download Speed' data={`${(this.state.torrent.downloadSpeed / 1024 / 1024).toFixed(2)} MB/s`} />
                    </div>
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Upload Speed' data={`${(this.state.torrent.uploadSpeed / 1024 / 1024).toFixed(2)} MB/s`} />
                    </div>
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Peer Count' data={this.state.torrent.numPeers} />
                    </div>
                </div>
            )
        }

        return null;
    }

    download_torrent_fields(){
        if(!this.state.is_downloading && !this.state.is_loaded){
            return (
                <div>
                    {this.render_server_torrents()}
                    {/* <Card>
                        <div className="margin-l">
                            <div>
                                <label htmlFor="magnet_link_input">Magnet Link</label>
                            </div>
                            <div>
                                <input id="magnet_link_input" type="text"></input>
                            </div>
                        </div>
                        <div className="margin-l">
                            <button onClick={() => this.load_torrent()}>Load Torrent</button>
                        </div>
                    </Card> */}
                </div>
            )
        }

        return null;
    }

    upload_torrent_fields(){
        if(!this.state.is_downloading && !this.state.is_loaded){
            return (
                <Card>
                    <div className="margin-l">
                        <div className="margin-m">
                            <div>
                                <label htmlFor="room_name">Room Name</label>
                            </div>
                            <div>
                                <input id="room_name"></input>
                            </div>
                        </div>
                        <div className="margin-m">
                            <input id="file_upload" type="file"></input>
                        </div>
                        
                        <div className="margin-m">
                            <button onClick={this.upload_file}>Upload File</button>
                        </div>
                    </div>
                    
                </Card>
            )
        }

        return null;
    }

    upload_torrent_file_fields(){
        return (
            <div className="card">
                <div>
                    <input id="torrent_file" type="file"></input>
                </div>
                <div>
                    <button onClick={this.upload_torrent}>Submit</button>
                </div>
            </div>
        )
    }

    append_client_log(log){
        console.log(log);
        this.setState({client_logs: this.state.client_logs.concat([log])});
    }

    client_logs(){
        return this.state.client_logs.map((l, index) => (
            <p key={`client_log_${index}`}>{l}</p>
        ));
    }

    append_torrent_log(log){
        console.log(log);
        this.setState({torrent_logs: this.state.torrent_logs.concat([log])});
    }

    torrent_logs(){
        return this.state.torrent_logs.map((l, index) => (
            <p key={`torrent_log_${index}`}>{l}</p>
        ));
    }

    append_wire_log(log){
        console.log(log);
        this.setState({wire_logs: this.state.wire_logs.concat([log])});
    }

    wire_logs(){
        return this.state.wire_logs.map((l, index) => (
            <p key={`wire_log_${index}`}>{l}</p>
        ));
    }

    logs(){
        if(this.state.show_logs){
            return (
                <div>
                    <div className="margin-tb-l">
                        <Card className="log_container" id="client_logs">
                            <div className="padding-m" style={{
                                overflow: 'hidden',
                            }}>
                                <h4 className="no-margin">Client Logs</h4>
                                {this.client_logs()}
                            </div>
                        </Card>
                    </div>
                    <div className="margin-tb-l"> 
                        <Card className="log_container" id="torrent_logs">
                            <div className="padding-m" style={{
                                overflow: 'hidden',
                            }}>
                                <h4 className="no-margin">Torrent Logs</h4>
                                {this.torrent_logs()}
                            </div>
                        </Card>
                    </div>
                    <div className="margin-tb-l"> 
                        <Card className="log_container" id="wire_logs">
                            <div className="padding-m" style={{
                                overflow: 'hidden',
                            }}>
                                <div className="flex col space-around">
                                    <h4 className="no-margin">Wire Logs</h4>
                                    <div className="flex row space-between">
                                        <p className="text-sm">Am Choking:</p>
                                        <p className="text-sm">{this.state.wire ? `${this.state.wire.amChoking}` : "n/a"}</p>
                                    </div>
                                    <div className="flex row space-between">
                                        <p className="text-sm">Peer Choking:</p>
                                        <p className="text-sm">{this.state.wire ? `${this.state.wire.peerChoking}` : "n/a"}</p>
                                    </div>
                                    
                                </div>
                                {this.wire_logs()}
                            </div>
                        </Card>
                    </div>
                </div>
            )
        }

        return null;
    }

    stats_container(){
        return (
            <>
                {this.download_torrent_fields()}
                {this.upload_torrent_fields()}
                {/* {this.upload_torrent_file_fields()} */}
                {this.show_stat_cards()}
                {
                    this.state.is_streamer
                    ?
                        <button onClick={() => {
                            this.setState({
                                show_stats: !this.state.show_stats
                            })
                        }}>
                            {this.state.show_stats ? "Hide" : "Show"} Stats
                        </button>
                    : null
                }
                
            </>
        )
    }

    render_video_player(){
        return (
            <div className="video_container card flex col margin-m" style={{
                display: (this.state.is_loaded || this.state.is_downloading) ? "block" : "none",
            }}>
                <video className="video_player" crossOrigin="anonymous" id='player'></video>
                {this.render_progress()}
            </div>
        )
    }

    render() {
        return (
            <div className="home">
                {this.render_video_player()}
                <div className="stats_container">
                    {this.stats_container()}
                </div>
                <div className="right_container">
                    {this.logs()}
                </div>
            </div>
        )
    }
}
