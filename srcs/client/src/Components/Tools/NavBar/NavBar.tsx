import React from "react"; 
import "./NavBar.css"
import Header from "../../../Header" 

export default function NavBar()
{
     const fortyTwoLogin = () => {
    window.open("http://127.0.0.1:4200/auth/42/register", "_self");
     }
    return (
        <ul>
            <li className="element" ><a href="Pong">PONG</a></li>
            <li className="elementBlock"><a href="News">Leaderboard</a></li>
            <li className="elementBlock"><a href="Contact">About</a></li>
            <li className="elementBlock"><a href="About">Home</a></li>
            <li className="elementSignIn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <button className="signinButton" onClick={fortyTwoLogin}>
                    Sign In
                    </button>
                    </li>
            < Header />
        </ul>
    )

}

