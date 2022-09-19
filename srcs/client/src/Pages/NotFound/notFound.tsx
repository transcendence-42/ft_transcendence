import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './notFound.css'
import '../../Components/Tools/LittlePong/littlePong.css'

/* Call UseNavigate declare it and use the function to navigate to main page */
export default function NotFound()
{
    const navigate = useNavigate();
    function goHome()
    {
        navigate("/");
    }
    return (
    <>
        <div>
            <h1 className="pinkText " style={{fontSize: "4vw"}}>Page not found</h1>
            </div>
                <div className="frameOfAnimation">
                    <div className="loading">
                        <span className="circle"></span>
                        <span className="line right"></span>
                        <span className="line left"></span>
                    </div>
                </div>
            <div className="goHome">
                <button onClick={goHome} className="playFlickering">Back to main page</button>
        </div>
    </>
    )
}
