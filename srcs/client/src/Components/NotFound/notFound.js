import React from "react";
import { useNavigate } from "react-router-dom";

//Call UseNavigate declare it and use an unknown function to navigate to main page
export default function NotFound()
{
    const navigate = useNavigate();
    function goHome()
    {
        navigate("/");
    }

    return (
        <div>
            <p> Error unknown path</p> 
            <button onClick={goHome}>Back to main page</button>
         </div>
      
    )
}