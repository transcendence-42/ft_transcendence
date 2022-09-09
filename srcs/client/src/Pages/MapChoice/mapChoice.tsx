import React, { useEffect } from "react";
import './mapChoice.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import AuthenticatedRoute from "../../Components/services/authenticatedRoute";
import Play from "../../Components/Tools/Button/Play";
import { Link } from "react-router-dom";
import "../../Components/Tools/VirtualPong/virtualPong.css"


export default function MapChoice () {

  
    return (
        <>
          <div className="titleChoiceMap" data-testid="tracker">
            <h2 className="pinkText " style={{fontSize: "4vw"}}>CHOOSE A MAP</h2>
          </div>
          <div className="mainFrame">
            <div className="frame1">
              <div className="field" style={{margin: "auto", height:"90%", width:"80%"}}>
                <div className="net"></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
            </div>
            <div className="frame2" style={{borderColor: "white"}} >
            <div className="field" style={{margin: "auto", height:"90%", width:"80%"}}>
                <div className="net" style={{color:"white"}}></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
            </div>
            
            <div className="frame3">
            <div className="field" style={{margin: "auto",height:"90%", width:"80%"}}>
                <div className="net"></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
            </div>
            
            <div className="frame4">
            <div className="field" style={{margin: "auto",height:"90%", width:"80%"}}>
                <div className="net"></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
            </div>
          </div>
   
         </>
    );
}

{/* 
</div>   
            <div className="field">
              <div className="net"></div>
              <div className="ping"></div>
              <div className="pong"></div>
              <div className="ball"></div>
            </div> */}

