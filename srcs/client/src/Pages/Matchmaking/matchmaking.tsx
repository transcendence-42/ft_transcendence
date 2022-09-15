import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './matchmaking.css'
import '../../Components/Tools/LittlePong/littlePong.css'

/* Call UseNavigate declare it and use an unknown function to navigate to main page */
export default function Matchmaking()
{
    const ref = useRef(null);
    const navigate = useNavigate();
    function goHome()
    {
        navigate("/");
    }

 

    return (
    <>
        <div>
        <h1 className="pinkText " style={{fontSize: "4vw"}}>We are looking for a player please wait ...</h1>
        </div>
            <div className="frameOfAnimation">
                <div className="loading">
                    <span className="circle"></span>
                    <span className="line right"></span>
                    <span className="line left"></span>
                </div>
        </div>
        <div className="goHome">
                <button onClick={goHome} className="playFlickering">Stop looking for a opponent</button>
        </div>
    </>
        )

}
// <div>
// <h1>Error unknown path</h1>
// <div className="animation">
//     <span className="circle"></span>
//     <span className="lineLeft"></span>
//     <span className="lineRight"></span>
// </div>
// <button onClick={goHome} className="button">Back to main page</button>
// </div>