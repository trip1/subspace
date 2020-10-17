import React, { Component } from 'react';
import Card from '../../Components/Containers/Card';


export default class Home extends Component {
    constructor(props){
        super();

        this.load_torrent = this.load_torrent.bind(this);
    }

    componentDidMount(){

    }

    load_torrent(){

    }

    render() {
        return (
            <div>
                <h2>Hello world</h2>
            </div>
        )
    }
}
