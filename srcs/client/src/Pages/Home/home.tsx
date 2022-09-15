import React, { useEffect } from "react";
import './home.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import AuthenticatedRoute from "../../Components/services/authenticatedRoute";
import Play from "../../Components/Tools/Button/Play";
import { Link } from "react-router-dom";
import "../../Components/Tools/VirtualPong/virtualPong.css"


export default function Home () {

  useEffect(() => {
    localStorage.getItem("pathIsFree");
    console.log("test");
  });

if (!(localStorage.getItem("pathIsFree")))
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
            <div className="blueContainer1"style={{width: "10vw",height: "15%%", top: "14%"}}>
              <Link className="playFlickering" style={{ cursor: "pointer" }} to={"/mapchoice"}> PLAY </Link> 
            </div>
            <div className="blueContainer2"style={{width: "10vw",height: "12%",top: "14%"}}>
              <Link className="playFlickering" style={{ cursor: "pointer" }} to={"/lobby"}> WATCH </Link> 
            </div>
          </div>
          <div className="homeElement2">
            <h2 className="blueText" style={{fontSize: "2vw"}}> Join Players From 42 School </h2>
          </div>
        </div>
       </>
  );
}
}
