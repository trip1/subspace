import React, { Component } from 'react';
import './card.css';

export default class Card extends Component {
    render() {
        return (
            <div className="card">
                {this.props.children}
            </div>
        )
    }
}
