import React, { Component } from 'react';
import Card from '../../Components/Containers/Card';
import {
    Link
} from 'react-router-dom';

export default class index extends Component {
    render() {
        return (
            <div className="flex space-between full-width">
                <Card>
                    <Link to="/stream"><h2>Stream</h2></Link>
                </Card>
                <Card className="full-width">
                    <Link to="/watch"><h2>Watch</h2></Link>
                </Card>
            </div>
        )
    }
}
