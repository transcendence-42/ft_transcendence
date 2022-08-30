import React, { useEffect, useState } from "react"

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { isNamespaceExport } from "typescript";

const registerFtUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=2e3349f31a5e931ce5989516b304753802675c87d27da637608291e2f03f5e26&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2F42%2Fredirect&response_type=code';

function Welcome() {

    function useFetch () {
        fetch('http://localhost:4200/auth/42/redirect?code=6fa73e382a16dd40ee34caea96a494cd5160be0dccdb53560ea88255fe2a3a42', {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'include',
            },
        ).then(res => {
                return res.json();
            }).catch((err) => console.log(err));
        return (<a href="http://localhost:3042/"></a>);
    }
  return (
        <div className='main'>
            <nav className='navBar'>
                <h2>Pong.</h2>
                <a href="https://api.intra.42.fr/oauth/authorize?client_id=2e3349f31a5e931ce5989516b304753802675c87d27da637608291e2f03f5e26&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2F42%2Fredirect&response_type=code">
                <button className='button' onClick={useFetch}>Sign in</button>
            </a>
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
