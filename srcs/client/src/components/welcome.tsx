import React, { useEffect, useState } from "react"

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { isNamespaceExport } from "typescript";


function Welcome() {
    
    // const [data,setData]=useState([]);

    //     const [statusMessage, setStatusMessage] = useState("TBD");
      
    //     const fetchData = () => {
    //       fetch("http://localhost:4200/auth/42/redirect/")
    //         .then((response) => response.json())
    //         .then((response) => {
    //           setStatusMessage(response.status);
    //         })
    //         .catch(() => {
    //           setStatusMessage("ERROR");
    //         });
    //         console.log()
    //     };
  return (
        <div className='main'>
            <nav className='navBar'>
                <h2>Pong.</h2>
            <a href="http://localhost:4200/auth/42/redirect/">
                <button className='button'>Sign in</button>
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
