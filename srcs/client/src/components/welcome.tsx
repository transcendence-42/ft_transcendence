import React from 'react';

import EmailAuth from './emailAuth';
import SchoolAuth from './schoolAuth';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'


function Welcome() {
    return (
        <div className='main'>
            <nav className='navBar'>
                <h2>Pong.</h2>
                <button className='button'>Sign in</button>
            </nav>
            <div className='description'>
                <h1>
                    ENTER<br/>
                    THE PONG<br/>
                    CONTEST
                </h1>
            </div>
            <div className='description'>
                <p>
                    Confront other players online and become the best at Pong!<br/>
                </p>
            </div>
        </div>
    );
}
export default Welcome;