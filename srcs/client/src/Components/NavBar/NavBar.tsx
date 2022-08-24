import React from "react"; 
import "./NavBar.css"




export default function NavBar()
{
    return (
        <ul>
            <li className="element" ><a href="default.asp">PONG</a></li>
            <li className="elementBlock"><a href="news.asp">News</a></li>
            <li className="elementBlock"><a href="contact.asp">Contact</a></li>
            <li className="elementBlock"><a href="about.asp">About</a></li>
        </ul>
    )

}

