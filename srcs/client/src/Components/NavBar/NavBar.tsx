import React from "react"; 
import "./NavBar.css"




export default function NavBar()
{
    return (
        <ul>
            <li className="element" ><a href="Pong">PONG</a></li>
            <li className="elementBlock"><a href="News">Leaderboard</a></li>
            <li className="elementBlock"><a href="Contact">About</a></li>
            <li className="elementBlock"><a href="About">Home</a></li>
            <li className="elementSignIn">
                <a href="Sign in">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Sign In
                </a></li>
        </ul>
    )

}

