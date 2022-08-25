import React from "react";
import {Routes, Route} from 'react-router-dom';
import NavBar from "../NavBar/NavBar";
import Play from "./Play"
import './Home.css';
import "../Tools/Box.css"


export default function Home () {
    return (
        <div >
            <Play />
            <h2 className="blueText" style={{fontSize: "50px"}}> ABCD </h2>
            <h2 className="yellowText" style={{fontSize: "50px"}} > ABCD </h2>
            <h2 className="pinkText" style={{fontSize: "70px"}}> ABCD </h2>

            <div className="yellowBox"
                style={{
                  width: "200px",
                  height: "200px",
                  left: "200px",
                  top: "550px"
                  }}>
                  <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2>
            </div>

            <div className="yellowBox2"
                style={{
                  width: "200px",
                  height: "200px",
                  left: "500px",
                  top: "550px"
              }}>
              <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2>
            </div>
        </div>
    );
}