import React, { Component } from 'react';
import Card from '../Containers/Card/index.jsx';

export default class StatsCard extends Component {
    render() {
        return (
            <Card>
                <div>{this.props.title}</div>
                <div>{this.props.data}</div>
            </Card>
        )
    }
}
