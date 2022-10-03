import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './notFound.css'
import '../../Components/Tools/LittlePong/littlePong.css'
import '../../Components/Tools/Text.css'
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container-fluid pt-5">
            <div className="row pb-5 pt-5">
                <h1 className="pinkText " style={{fontSize: "4vw"}}>Page not found</h1>
            </div>
            <div className="row pb-5 pt-5">
                <div className="col"></div>
                <div className="frameOfAnimation col ">
                    <div className="loading">
                        <span className="circle"></span>
                        <span className="line right"></span>
                        <span className="line left"></span>
                    </div>
                </div>
                <div className="col"></div>
            </div>
            <div className="row pb-5 pt-5 ">
                <div className="col"></div>
                <div className=" col text-center ">
                    <button onClick={goHome} className="btn goHome">Back to main page</button>
                </div>
                <div className="col"></div>
            </div>
        </div>
    </>
    )
}
