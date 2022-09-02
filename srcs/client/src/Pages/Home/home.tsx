import React, { useEffect, useState } from "react";
import './home.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import PongIMG from "./Pong.jpg";


export default function Home () {

    return (
        <>
        <div className="home" >
          <div className="homeElement">
            <h2 className="pinkText " style={{fontSize: "4vw"}}> ENTER THE PONG CONTEST ! </h2>
            </div>
            <div className="homeElement">
            <h2 className="blueText" style={{fontSize: "1.5vw"}}>  Confront other players
                                                                  online and become the best at Pong! </h2>
            </div>
              <img src={PongIMG} alt="Pong" className="pongImage"/>
            <div className="homeElement">
            <h2 className="blueText" style={{fontSize: "2vw"}}> Join Players From 42 School </h2>
            </div>
        </div>
         </>
    );
}

