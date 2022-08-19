
import React from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './Home.css';

function SchoolAuth() {
    return (
        <div className='two'>
            <a href="http://localhost:4200/auth/42/redirect/">
                <button className='school btn btn-light' >42 authentification</button>
            </a>
        </div>
    );
}

export default SchoolAuth;