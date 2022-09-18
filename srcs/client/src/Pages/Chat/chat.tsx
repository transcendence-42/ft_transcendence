import './chat.css';
import '../../Components/Tools/Box.css';
// import { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function chat() {
    
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-2 rounded-pill'>
                    <div className='col'>
                        <p className='titles'>Channels</p>
                    </div>
                    <div className='col'>
                        <button className='plus float-end data-toggle="modal" data-target="#exampleModal" rounded-pill'>+</button>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-2 rounded-pill'>
                    <div className='col'>
                        <p className='titles'>Direct messages</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

