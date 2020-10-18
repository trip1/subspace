import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import Card from '../../Components/Containers/Card';
import StatsCard from '../../Components/StatsCard';
// import SimplePeer from 'simple-peer';
import StunServers from '../../../utils/constants/stun-servers';
import './home.css';

const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

export default class Home extends Component {
    constructor(props){
        super();

        const client = new WebTorrent({
            tracker: {
                rtcConfig: {
                    iceServers: [
                        {
                            urls: [
                                // 'stun:stun.l.google.com:19302',
                                // 'stun:global.stun.twilio.com:3478'
                                ...StunServers
                            ]
                        }
                    ],
                }
              }
        });
        this.state = {
            client,
            torrent: null,
            is_downloading: false,
            is_loaded: false,
            download_progress: 0,
            upload_count: 0,
            show_stats: true,
            client_logs: [],
            torrent_logs: [],
        }

        this.client_logs = this.client_logs.bind(this);
        this.torrent_logs = this.torrent_logs.bind(this);
        this.upload_file = this.upload_file.bind(this);
        this.load_torrent = this.load_torrent.bind(this);
        this.update_state = this.update_state.bind(this);
        this.render_progress = this.render_progress.bind(this);
        this.show_stat_cards = this.show_stat_cards.bind(this);
        this.append_torrent_log = this.append_torrent_log.bind(this);
        this.torrent_downloading = this.torrent_downloading.bind(this);
        this.upload_torrent_fields = this.upload_torrent_fields.bind(this);
        this.download_torrent_fields = this.download_torrent_fields.bind(this);
    }

    componentDidMount(){
        // this.load_torrent();
        this.state.client.on('torrent', l => {
            this.setState({
                client_logs: this.state.client_logs.concat([`${l}`]),
            });
        });

        this.state.client.on('error', l => {
            this.setState({
                client_logs: this.state.client_logs.concat([`${l}`]),
            });
        })
    }

    load_torrent(){
        let magnet_link = document.getElementById('magnet_link_input').value.trim();
        if(!magnet_link || magnet_link === ""){
            magnet_link = torrentId;
        }

        const torrent = this.state.client.add(magnet_link);
        
        torrent.on('metadata', () => {
            console.log('Meta', torrent);
        });

        torrent.on('ready', () => {
            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4');
            });

            this.setState({
                torrent,
                is_downloading: true,
            })
    
            // file.appendTo('body');
            file.renderTo('video#player');
        });

        setInterval(this.update_state, 1000);

        torrent.on('done', () => {
            this.setState({
                is_loaded: true,
                is_downloading: false,
            })
        })
    }

    upload_file(){
        const file = document.getElementById('file_upload').files[0];
        console.log(file);
        this.state.client.seed(file, torrent => {
            console.log(torrent);
            torrent.on('infoHash', () => this.append_torrent_log('Hash Determined.'));
            torrent.on('metadata', () => this.append_torrent_log('Metadata Determined.'));
            torrent.on('ready', () => this.append_torrent_log('Torrent Ready.'));
            torrent.on('warning', (w) => this.append_torrent_log(`WARN: ${w}.`));
            torrent.on('error', (err) => this.append_torrent_log(`ERROR: ${err}.`));

            this.setState({
                torrent,
                is_loaded: true,
                is_downloading: false,
            });

            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4');
            });

            file.renderTo('video#player');
            setInterval(this.update_state, 1000);
        })
    }

    update_state(){
        this.setState({
            download_progress: this.state.torrent.progress,
            upload_count: this.state.torrent.uploaded,
        })
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
        if((this.state.is_downloading || this.state.is_loaded) && this.state.show_stats){
            return (
                <div className="full_width">
                    <div className="full_width margin-tb-l">
                        <StatsCard title='Link' data={(this.state.torrent.magnetURI)} />
                    </div>
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

        return false;
    }

    download_torrent_fields(){
        if(!this.state.is_downloading && !this.state.is_loaded){
            return (
                <Card>
                    <div className="margin-l">
                        <div>
                            <label htmlFor="magnet_link_input">Magnet Link</label>
                        </div>
                        <div>
                            <input id="magnet_link_input" type="text"></input>
                        </div>
                    </div>
                    <div className="margin-l">
                        <button onClick={this.load_torrent}>Load Torrent</button>
                    </div>
                </Card>
            )
        }

        return null;
    }

    upload_torrent_fields(){
        if(!this.state.is_downloading && !this.state.is_loaded){
            return (
                <Card>
                    <div className="margin-l">
                        {/* <div>
                            <label htmlFor="file_upload">Upload File</label>
                        </div> */}
                        <div>
                            <input id="file_upload" type="file"></input>
                        </div>
                    </div>
                    <div className="margin-l">
                        <button onClick={this.upload_file}>Upload File</button>
                    </div>
                </Card>
            )
        }

        return null;
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

    render() {
        return (
            <div className="home">
                <div className="left_container">
                    {this.download_torrent_fields()}
                    {this.upload_torrent_fields()}
                    {this.show_stat_cards()}
                    <div>
                        <Card className="log_container" id="client_logs">
                            <h5>Client Logs</h5>
                            {this.client_logs()}
                        </Card>
                    </div>
                    <div>
                        <Card className="log_container" id="torrent_logs">
                            <h5>Torrent Logs</h5>
                            {this.torrent_logs()}
                        </Card>
                    </div>
                </div>
                <Card className="video_container">
                    <video className="video_player" crossOrigin="anonymous" width="600px" height="200px" id='player'></video>
                    {this.render_progress()}
                </Card>
            </div>
        )
    }
}
