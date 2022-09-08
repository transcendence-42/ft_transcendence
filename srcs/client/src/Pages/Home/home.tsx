import React, { useEffect, useState } from "react";
import './home.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import PongIMG from "./Pong.jpg";


export default function Home () {

  useEffect(() => {
    const data = window.localStorage.getItem("StillConnected");
    if (data)
    {
        setIsLogged(JSON.parse(data));
    }

  }, []);

  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    window.localStorage.setItem("StillConnected", JSON.stringify(isLogged));
}, []);
console.log(isLogged);

if (!isLogged)
{
    return (
        <>
        <div className="home" data-testid="tracker" >
          <div className="title">
            <h2 className="pinkText " style={{fontSize: "4vw"}}> ENTER THE PONG CONTEST ! </h2>  
          </div>   
            <div className="homeElement1">
              <h2 className="blueText" style={{fontSize: "1.5vw"}}>  Confront other players
                                                                  online and become the best at Pong! </h2>
            </div>
            <div className="field">
              <div className="net"></div>
              <div className="ping"></div>
              <div className="pong"></div>
              <div className="ball"></div>
            </div>
            <div className="homeElement2">
              <h2 className="blueText" style={{fontSize: "2vw"}}> Join Players From 42 School </h2>
            </div>
          </div>
         </>
    );
  }
  else
  {
    return (
      <>
        <div className="home" data-testid="tracker" >
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
}
