!function(e){function t(t){for(var o,s,i=t[0],l=t[1],d=t[2],_=0,h=[];_<i.length;_++)s=i[_],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&h.push(r[s][0]),r[s]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);for(c&&c(t);h.length;)h.shift()();return a.push.apply(a,d||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,i=1;i<n.length;i++){var l=n[i];0!==r[l]&&(o=!1)}o&&(a.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},r={0:0},a=[];function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var d=0;d<i.length;d++)t(i[d]);var c=l;a.push([312,1]),n()}({182:function(e,t,n){"use strict";var o=n(79),r=n.n(o)()((function(e){return e[1]}));r.push([e.i,'.card {\n/* Add shadows to create the "card" effect */\n    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n    transition: 0.3s;\n}\n  \n/* On mouse-over, add a deeper shadow */\n.card:hover {\n    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n}\n  \n/* Add some padding inside the card container */\n.container {\n    padding: 2px 16px;\n}',""]),t.a=r},183:function(e,t,n){"use strict";var o=n(79),r=n.n(o)()((function(e){return e[1]}));r.push([e.i,".home {\n    display: flex;\n    flex-direction: column;\n    flex-wrap: wrap;\n    justify-content: space-around;\n}\n\n.stats_container {\n    min-width: 240px;\n    display: flex;\n}\n\n.right_container {\n    min-width: 240px;\n    padding-left: 16px;\n    max-width: 33%;\n}\n\n.progress_container {\n    width: 100%;\n}\n\n.progress_bar {\n    width: 100%;\n    background-color: lightblue;\n    animation-duration: 0.2s;\n    transition-duration: 0.2s;\n}\n\n.video_container {\n    flex-grow: 1;\n}\n\n.video_player {\n    width: auto;\n    max-width: 100%;\n}\n\n.log_container {\n    max-height: 120px;\n    overflow: auto;\n}\n\n.text-sm {\n    font-size: smaller;\n}",""]),t.a=r},184:function(e,t,n){"use strict";var o=n(79),r=n.n(o)()((function(e){return e[1]}));r.push([e.i,".no-margin {\n    margin: 0px;\n}\n\n.margin-m {\n    margin: 8px;\n}\n\n.margin-l {\n    margin: 16px;\n}\n\n.margin-tb-l {\n    margin: 16px 0px;\n}\n\n.no-padding {\n    padding: 0px;\n}\n\n.padding-sm {\n    padding: 4px;\n}\n\n.padding-m {\n    padding: 8px;\n}\n\n.full_width {\n    width: 100%;\n}\n\n.hide_overflow {\n    overflow: hidden;\n}\n\n.flex {\n    display: flex;\n}\n\n.row {\n    flex-direction: row;\n}\n\n.col {\n    flex-direction: column;\n}\n\n.end {\n    justify-content: end;\n}\n\n.row-center {\n    justify-content: center;\n}\n\n.space-between {\n    justify-content: space-between;\n}\n\n.space-around {\n    justify-content: space-around;\n}\n\n.align-center {\n    align-content: center;\n    align-items: center;\n}",""]),t.a=r},307:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return u}));var o=n(0),r=n.n(o),a=n(181),s=n.n(a),i=n(51),l=n(80),d=n(308),c=n.n(d),_=n(52);n(734);const h=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://video.blender.org:443/tracker/socket","wss://tube.privacytools.io:443/tracker/socket","wss://tracker.sloppyta.co:443/announce","wss://tracker.lab.vvc.niif.hu:443/announce","wss://tracker.files.fm:7073/announce","wss://peertube.cpy.re:443/tracker/socket","wss://open.tube:443/tracker/socket","wss://hub.bugout.link:443/announce"];class u extends o.Component{constructor(e){super(),this.state={client:new s.a,wire:null,torrent:null,is_downloading:!1,is_loaded:!1,download_progress:0,upload_count:0,show_stats:!0,client_logs:[],torrent_logs:[],wire_logs:[],server_torrents:[],show_logs:!1,room:"",is_viewer:!1,is_streamer:!1},this.upload_torrent_file_fields=this.upload_torrent_file_fields.bind(this),this.on_play=this.on_play.bind(this),this.on_pause=this.on_pause.bind(this),this.wire_logs=this.wire_logs.bind(this),this.new_client=this.new_client.bind(this),this.client_logs=this.client_logs.bind(this),this.handle_wire=this.handle_wire.bind(this),this.upload_file=this.upload_file.bind(this),this.get_timecode=this.get_timecode.bind(this),this.torrent_logs=this.torrent_logs.bind(this),this.load_torrent=this.load_torrent.bind(this),this.update_state=this.update_state.bind(this),this.handle_socket=this.handle_socket.bind(this),this.stats_container=this.stats_container.bind(this),this.upload_torrent=this.upload_torrent.bind(this),this.append_wire_log=this.append_wire_log.bind(this),this.render_progress=this.render_progress.bind(this),this.show_stat_cards=this.show_stat_cards.bind(this),this.found_new_torrent=this.found_new_torrent.bind(this),this.append_client_log=this.append_client_log.bind(this),this.append_torrent_log=this.append_torrent_log.bind(this),this.update_video_state=this.update_video_state.bind(this),this.torrent_downloading=this.torrent_downloading.bind(this),this.upload_torrent_fields=this.upload_torrent_fields.bind(this),this.render_server_torrents=this.render_server_torrents.bind(this),this.download_torrent_fields=this.download_torrent_fields.bind(this)}new_client(){let e=new s.a;return e.on("warning",e=>this.append_client_log("WARN: "+e)),e.on("error",e=>this.append_client_log("ERROR: "+e)),console.log("Client ready"),e}componentDidMount(){_.a.init_socket(this.handle_socket),_.a.join_lobby("waiting_room",this.handle_socket),this.state.client.on("warn",e=>this.append_client_log("WARN: "+e)),this.state.client.on("error",e=>this.append_client_log("ERROR: "+e));const e=document.getElementById("player");e.addEventListener("play",this.on_play),e.addEventListener("pause",this.on_pause)}on_play(){console.log("Playing!"),_.a.video_state({room:this.state.room,status:"play",timestamp:this.get_timecode(),type:"video_state"})}on_pause(){console.log("Paused!"),_.a.video_state({room:this.state.room,status:"pause",timestamp:this.get_timecode(),type:"video_state"})}get_timecode(){return document.getElementById("player").currentTime}handle_socket(e){switch(console.log("Socket message",e),e.type){case"init":const t=[];for(let n in e.payload)t.push(e.payload[n]);console.log("rooms",t),t.length>0&&this.found_new_torrent(t,!0);break;case"torrent_load":this.found_new_torrent(e,!1);break;case"video_state":this.update_video_state(e);break;default:console.log("Socket event not handled",e)}}update_video_state(e){const t=document.getElementById("player");switch(e.status){case"play":t.play();break;case"pause":t.pause()}t.currentTime=e.timestamp}found_new_torrent(t,n=!1){console.log("Found new torrents",t);const o=[].concat(this.state.server_torrents);n?t.forEach(t=>{o.push({name:t.name,buff:e.from(t.torrentFile)})}):o.push({name:t.name,buff:e.from(t.payload.torrentFile)}),this.setState({server_torrents:o})}render_server_torrents(){if(this.state.server_torrents.length>0){const e=[];return this.state.server_torrents.forEach((t,n)=>{e.push(r.a.createElement("div",{onClick:()=>this.load_torrent(t),key:"server_torrent_"+n},r.a.createElement(i.a,null,t.name)))}),r.a.createElement("div",null,e)}return null}load_torrent(e){console.log(e);let t=e.buff;t||(t=e.torrData.magnetURI),t||(t=document.getElementById("magnet_link_input").value.trim()),t&&""!==t||(t="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"),_.a.join_lobby(e.name,this.handle_socket),setInterval(this.update_state,250),this.append_torrent_log("Adding torrent"),console.log("Loading file",t);const n=this.state.client.add(t);n.on("ready",()=>{this.append_torrent_log("Torrent Ready!");const e=n.files.find((function(e){return e.name.endsWith(".mp4")}));this.setState({torrent:n,is_viewer:!0,is_downloading:!0}),e.renderTo("video#player")}),n.on("done",()=>{this.append_torrent_log("Torrent done"),this.setState({is_loaded:!0,is_downloading:!1})}),n.on("warning",e=>this.append_torrent_log(`WARN: ${e}.`)),n.on("error",e=>this.append_torrent_log(`ERROR: ${e}.`)),n.on("infoHash",()=>this.append_torrent_log("Hash Determined.")),n.on("metadata",()=>this.append_torrent_log("Metadata Determined.")),n.on("noPeers",()=>this.append_torrent_log("No Peers")),n.on("wire",this.handle_wire)}upload_file(){const e=document.getElementById("file_upload").files[0],t=document.getElementById("room_name").value;setInterval(this.update_state,250),this.state.client.seed(e,{announce:h,name:c.a.generate()+".mp4"},e=>{console.log(e),e.on("infoHash",()=>this.append_torrent_log("Hash Determined.")),e.on("metadata",()=>this.append_torrent_log("Metadata Determined.")),e.on("ready",()=>this.append_torrent_log("Torrent Ready.")),e.on("warning",e=>this.append_torrent_log(`WARN: ${e}.`)),e.on("error",e=>this.append_torrent_log(`ERROR: ${e}.`)),e.on("wire",this.handle_wire),this.setState({torrent:e,room:t,is_streamer:!0,is_loaded:!0,is_downloading:!1}),_.a.submit_torrent(t,{infoHash:e.infoHash,magnetURI:e.magnetURI,torrentFile:e.torrentFile}),this.append_torrent_log(e.magnetURI);const n=e.files.find((function(e){return e.name.endsWith(".mp4")}));n&&n.renderTo("video#player")})}upload_torrent(){const e=document.getElementById("torrent_file").files[0],t=document.getElementById("room_name").value,n=this.state.client.add(e);setInterval(this.update_state,250),this.append_torrent_log("Adding torrent"),console.log("Loading file",n),this.setState({torrent:n,room:t,is_streamer:!0,is_loaded:!0,is_downloading:!1}),_.a.submit_torrent(t,{infoHash:n.infoHash,magnetURI:n.magnetURI,torrentFile:n.torrentFile}),n.on("done",()=>{this.append_torrent_log("Torrent done"),this.setState({is_loaded:!0,is_downloading:!1})}),n.on("warning",e=>this.append_torrent_log(`WARN: ${e}.`)),n.on("error",e=>this.append_torrent_log(`ERROR: ${e}.`)),n.on("infoHash",()=>this.append_torrent_log("Hash Determined.")),n.on("metadata",()=>this.append_torrent_log("Metadata Determined.")),n.on("noPeers",()=>this.append_torrent_log("No Peers")),n.on("wire",this.handle_wire)}handle_wire(e){this.setState({wire:e}),e.on("port",t=>{if(!e.remoteAddress)return this._debug("ignoring PORT from peer with no address");console.log(e.remoteAddress,t),this.state.client.dht.addNode({host:e.remoteAddress,port:t})}),e.on("handshake",(e,t,n)=>{console.log("Handshake from",t),console.log(n.dht),console.log(n.extended)}),e.on("choke",()=>{console.log("Peer is choking us"),this.append_wire_log("Peer is choking us")}),e.on("unchoke",()=>{console.log("Peer is no longer choking us"),this.append_wire_log("Peer is no longer choking us")}),e.on("interested",()=>{console.log("Peer is interested"),this.append_wire_log("Peer is interested")}),e.on("uninterested",()=>{console.log("Peer is uninterested"),this.append_wire_log("Peer is uninterested")})}update_state(){this.state.torrent&&this.state.torrent.progress&&this.setState({download_progress:this.state.torrent.progress,upload_count:this.state.torrent.uploaded})}torrent_downloading(e,t){console.log("Downloading:",e,"Progress:",(100*t.progress).toFixed(0)),this.setState({download_progress:t.progress})}torrent_uploading(e,t){console.log("Uploading:",e,"Total:",(100*t.progress).toFixed(0)),this.setState({download_progress:t.progress})}render_progress(){return this.state.is_downloading&&!this.state.is_loaded?r.a.createElement("div",{className:"progress_container"},r.a.createElement("progress",{className:"progress_bar",value:this.state.torrent.progress})):null}show_stat_cards(){return(this.state.is_downloading||this.state.is_loaded)&&this.state.show_stats&&this.state.is_streamer?r.a.createElement("div",{className:"full_width flex space-around"},r.a.createElement("div",{className:"full_width margin-tb-l"},r.a.createElement(l.a,{title:"Ratio",data:this.state.torrent.ratio.toFixed(2)})),r.a.createElement("div",{className:"full_width margin-tb-l"},r.a.createElement(l.a,{title:"Time Left",data:(this.state.torrent.timeRemaining/1e3).toFixed(0)})),r.a.createElement("div",{className:"full_width margin-tb-l"},r.a.createElement(l.a,{title:"Download Speed",data:(this.state.torrent.downloadSpeed/1024/1024).toFixed(2)+" MB/s"})),r.a.createElement("div",{className:"full_width margin-tb-l"},r.a.createElement(l.a,{title:"Upload Speed",data:(this.state.torrent.uploadSpeed/1024/1024).toFixed(2)+" MB/s"})),r.a.createElement("div",{className:"full_width margin-tb-l"},r.a.createElement(l.a,{title:"Peer Count",data:this.state.torrent.numPeers}))):null}download_torrent_fields(){return this.state.is_downloading||this.state.is_loaded?null:r.a.createElement("div",null,this.render_server_torrents())}upload_torrent_fields(){return this.state.is_downloading||this.state.is_loaded?null:r.a.createElement(i.a,null,r.a.createElement("div",{className:"margin-l"},r.a.createElement("div",{className:"margin-m"},r.a.createElement("div",null,r.a.createElement("label",{htmlFor:"room_name"},"Room Name")),r.a.createElement("div",null,r.a.createElement("input",{id:"room_name"}))),r.a.createElement("div",{className:"margin-m"},r.a.createElement("input",{id:"file_upload",type:"file"})),r.a.createElement("div",{className:"margin-m"},r.a.createElement("button",{onClick:this.upload_file},"Upload File"))))}upload_torrent_file_fields(){return r.a.createElement("div",{className:"card"},r.a.createElement("div",null,r.a.createElement("input",{id:"torrent_file",type:"file"})),r.a.createElement("div",null,r.a.createElement("button",{onClick:this.upload_torrent},"Submit")))}append_client_log(e){console.log(e),this.setState({client_logs:this.state.client_logs.concat([e])})}client_logs(){return this.state.client_logs.map((e,t)=>r.a.createElement("p",{key:"client_log_"+t},e))}append_torrent_log(e){console.log(e),this.setState({torrent_logs:this.state.torrent_logs.concat([e])})}torrent_logs(){return this.state.torrent_logs.map((e,t)=>r.a.createElement("p",{key:"torrent_log_"+t},e))}append_wire_log(e){console.log(e),this.setState({wire_logs:this.state.wire_logs.concat([e])})}wire_logs(){return this.state.wire_logs.map((e,t)=>r.a.createElement("p",{key:"wire_log_"+t},e))}logs(){return this.state.show_logs?r.a.createElement("div",null,r.a.createElement("div",{className:"margin-tb-l"},r.a.createElement(i.a,{className:"log_container",id:"client_logs"},r.a.createElement("div",{className:"padding-m",style:{overflow:"hidden"}},r.a.createElement("h4",{className:"no-margin"},"Client Logs"),this.client_logs()))),r.a.createElement("div",{className:"margin-tb-l"},r.a.createElement(i.a,{className:"log_container",id:"torrent_logs"},r.a.createElement("div",{className:"padding-m",style:{overflow:"hidden"}},r.a.createElement("h4",{className:"no-margin"},"Torrent Logs"),this.torrent_logs()))),r.a.createElement("div",{className:"margin-tb-l"},r.a.createElement(i.a,{className:"log_container",id:"wire_logs"},r.a.createElement("div",{className:"padding-m",style:{overflow:"hidden"}},r.a.createElement("div",{className:"flex col space-around"},r.a.createElement("h4",{className:"no-margin"},"Wire Logs"),r.a.createElement("div",{className:"flex row space-between"},r.a.createElement("p",{className:"text-sm"},"Am Choking:"),r.a.createElement("p",{className:"text-sm"},this.state.wire?""+this.state.wire.amChoking:"n/a")),r.a.createElement("div",{className:"flex row space-between"},r.a.createElement("p",{className:"text-sm"},"Peer Choking:"),r.a.createElement("p",{className:"text-sm"},this.state.wire?""+this.state.wire.peerChoking:"n/a"))),this.wire_logs())))):null}stats_container(){return r.a.createElement(r.a.Fragment,null,this.download_torrent_fields(),this.upload_torrent_fields(),this.show_stat_cards(),this.state.is_streamer?r.a.createElement("button",{onClick:()=>{this.setState({show_stats:!this.state.show_stats})}},this.state.show_stats?"Hide":"Show"," Stats"):null)}render(){return r.a.createElement("div",{className:"home"},r.a.createElement("div",{className:"video_container card flex col margin-m"},r.a.createElement("video",{className:"video_player",crossOrigin:"anonymous",id:"player"}),this.render_progress()),r.a.createElement("div",{className:"stats_container"},this.stats_container()),r.a.createElement("div",{className:"right_container"},this.logs()))}}}).call(this,n(2).Buffer)},312:function(e,t,n){n(313),e.exports=n(739)},509:function(e,t){},51:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var o=n(0),r=n.n(o),a=n(78),s=n.n(a),i=n(182),l={insert:"head",singleton:!1};s()(i.a,l),i.a.locals;class d extends o.Component{render(){return r.a.createElement("div",{className:"card margin-m padding-m"},this.props.children)}}},511:function(e,t){},52:function(e,t,n){"use strict";var o=n(309),r=n.n(o);const a=window.location.hostname;let s=":8080";a.includes("nolife")&&(s="");const i=r()(a+s,{path:"/wss",autoConnect:!1});i.on("connect",()=>{console.log("Connection established")}),i.on("torrent_load",e=>{console.log(e)}),i.on("new_user",e=>{console.log(e)}),t.a={join_lobby:function(e="waiting_room",t){console.log("Joining lobby",e),i.emit("subscribe",e)},init_socket:function(e){i.connect(),i.on("message",e),i.on("room_msg",e)},video_state:function(e){i.emit("video_state",e)},submit_torrent:function(e,t=""){console.log("Broadcasting torrent",t.infoHash),i.emit("torrent_load",{name:e,payload:t,type:"torrent_load"})}}},525:function(e,t){},528:function(e,t){},529:function(e,t){},532:function(e,t){},535:function(e,t){},537:function(e,t){},553:function(e,t){},561:function(e,t){},565:function(e,t){},566:function(e,t){},567:function(e,t){},573:function(e,t){},576:function(e,t){},578:function(e,t){},579:function(e,t){},583:function(e,t){},589:function(e,t){},590:function(e,t){},621:function(e,t){},632:function(e,t){},634:function(e,t){},659:function(e,t){},661:function(e,t){},662:function(e,t){},669:function(e,t){},671:function(e,t){},689:function(e,t){},691:function(e,t){},703:function(e,t){},706:function(e,t){},729:function(e,t){},734:function(e,t,n){"use strict";var o=n(78),r=n.n(o),a=n(183),s={insert:"head",singleton:!1};r()(a.a,s),a.a.locals},739:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(306),s=n.n(a),i=n(310),l=n(13),d=n(307),c=n(78),_=n.n(c),h=n(184),u={insert:"head",singleton:!1};_()(h.a,u),h.a.locals;function p(){return r.a.createElement(i.a,null,r.a.createElement(l.c,null,r.a.createElement(l.a,{path:"/"},r.a.createElement(d.a,null))))}var m=document.getElementById("root");s.a.render(r.a.createElement(p,null),m)},80:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var o=n(0),r=n.n(o),a=n(51);class s extends o.Component{render(){return r.a.createElement(a.a,null,r.a.createElement("div",null,this.props.title),r.a.createElement("div",null,this.props.data))}}}});