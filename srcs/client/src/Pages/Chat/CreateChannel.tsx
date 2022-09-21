import './CreateChannel.css';
import React from 'react';

export default function CreateChannel() {

    return (
        <>
            <label className="form-label">Name</label>
            <input type="name" className="form-control form-control-margin" placeholder="# channel-name"></input>
            <ul className="list-group">
                <li className="list-group-item item-custom">
                    <input className="form-check-input me-3" type="checkbox"></input>
                    Make public
                </li>
                <li className="list-group-item item-custom">
                    <input className="form-check-input me-3" type="checkbox"></input>
                    Make private
                </li>
                <li className="list-group-item item-custom">
                    <input className="form-check-input me-3" type="checkbox" data-bs-toggle="collapse" data-bs-target="#collapseProtected" aria-expanded="false" aria-controls="collapseProtected"></input>
                    Make protected with password
                    <div className="collapse collapse-margin" id="collapseProtected">
                        <input type="name" className="form-control form-control-margin" placeholder="Password"></input>
                    </div>
                </li>
            </ul>
        </>
    );
}