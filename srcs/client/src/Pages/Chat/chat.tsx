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
                        <p className='channels'>Channels</p>
                    </div>
                    <div className='col'>
                        <button className='plus pull-right'>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

//<div className='col-10 rounded-pill'>col 2</div>

