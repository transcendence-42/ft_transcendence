import React from 'react';
import './FriendList.css';

export default function FriendList() {

    return (
        <ul className="list-group">
                <li className="list-group-item item-custom">
                    Friend
                    <input className="form-check-input checkbox-margin" type="checkbox"></input>
                </li>
            </ul>
    );
}