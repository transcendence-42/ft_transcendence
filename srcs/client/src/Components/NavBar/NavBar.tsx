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
            <a href="https://api.intra.42.fr/oauth/authorize?client_id=2e3349f31a5e931ce5989516b304753802675c87d27da637608291e2f03f5e26&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2F42%2Fredirect&response_type=code">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Sign In
                </a></li>
        </ul>
    )

}

