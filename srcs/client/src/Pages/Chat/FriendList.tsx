import React from 'react';
import './FriendList.css';

export default function FriendList() {

    return (
        // <ul className="list-group">
        //         <li className="list-group-item item-custom">
        //             Friend
        //             <input className="form-check-input checkbox-margin" type="checkbox"></input>
        //         </li>
        //     </ul>
        <>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Friend 1
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"></input>
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Friend 2
                </label>
            </div>
        </>
    );
}