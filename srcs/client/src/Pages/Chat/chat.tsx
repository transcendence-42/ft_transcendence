import './chat.css';
import '../../Components/Tools/Box.css';
// import { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function chat() {
    
    return (
        
        <div className='container'>
            <div className='row row-color'>
                <div className='col-2 rounded-4 vh-100 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='yellow-titles'>Channels</p>
                        </div>
                        <div className='col'>
                            <br></br>
                            <button className='plus float-end data-toggle="modal" data-target="#exampleModal" rounded-pill'>+</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col overflow-auto scroll-bar'>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <div className='row'>
                        <div className='col'>
                            <p className='yellow-titles'>Messages</p>
                        </div>
                        <div className='col'>
                            <button className='plus float-end data-toggle="modal" data-target="#exampleModal" rounded-pill'>+</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col overflow-auto scroll-bar'>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Scroll</p>
                        </div>
                    </div>
                </div>
                <div className='col-8 rounded-4 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='blue-titles'>Channel Name</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <input type='text' className='rounded-4 input-field-chat yellow-box-chat' placeholder="Send a message..."></input>
                        </div>
                    </div>
                </div>
                <div className='col-2 rounded-4 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='blue-titles center-position'>Members</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
