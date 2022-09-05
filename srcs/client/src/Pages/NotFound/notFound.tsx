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
            <h1>Test</h1>
            <p className="message" data-testid="message"> Error unknown path</p> 
            <button onClick={goHome} className="button">Back to main page</button>
         </div>
    );
}