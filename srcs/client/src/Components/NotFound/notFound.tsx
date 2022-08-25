import React from "react";
import { useNavigate } from "react-router-dom";
import './notFound.css'

/* Call UseNavigate declare it and use an unknown function to navigate to main page */
export default function NotFound()
{
    const navigate = useNavigate();
    function goHome()
    {
        navigate("/");
    }

    return (
        <div>
            <p className="message"> Error unknown path</p> 
            <button onClick={goHome} className="button">Back to main page</button>
         </div>
    );
}