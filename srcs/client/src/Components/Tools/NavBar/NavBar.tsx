import React from "react";
import {Link, Outlet} from 'react-router-dom'
import "./NavBar.css"
import "./ProfilNavBar.tsx"
import "../Text.css"
import ProfilNavBar from "./ProfilNavBar"
import SignIn from "./SignIn"
import {useState, useEffect} from "react"

export default function NavBar(props: any)
{
    const [userID, setUserID] = useState<number>(1);

    if (props.authorize)
    {
        return (
            <div className="navBar">
            <div className="menuInNavBar">
            <div className="buttonInNavBar">
            <Link  to="/"> <h2 className="blueText"> PONG </h2> </Link>
             </div>
              <div className="buttonInNavBar">
              <Link  to="/home"> <h2 className="yellowText"  > Home </h2> </Link>
             </div>
             <div className="buttonInNavBar">
             <Link  to="/about"><h2 className="yellowText" > About </h2> </Link>
             </div>
             <div className="buttonInNavBar">
             <Link  to="/chat">  <h2 className="yellowText" > Chat </h2> </Link>
             </div>
             <div className="buttonInNavBar">
             <Link  to="/leaderboard">  <h2 className="yellowText" > Leaderboard </h2> </Link>
             </div>
             <div className="buttonInNavBar">
             <Link  to="/profile" state={{userID}}> <ProfilNavBar /> </Link>
            </div>
            </div>
          </div>
        )
    }
    else
    {
        return (
            <div className="navBar">
            <div className="menuInNavBar">
            <div className="buttonInNavBar">
                <h2 className="blueText"> PONG </h2>
            </div>
            <div className="buttonInNavBar">
                <h2 className="yellowText" > Home </h2>
            </div>
            <div className="buttonInNavBar">
                <h2 className="yellowText" > About </h2>
            </div>
            <div className="buttonInNavBar">
                <h2 className="yellowText" > Leaderboard </h2>
            </div>
            <div className="buttonInNavBar">
                <SignIn />
            </div>
            </div>
        </div>
        )
    }
}

// <ul>
// <li className="element" ><a href="Pong">PONG</a></li>
// <li className="elementBlock"><a href="News">Leaderboard</a></li>
// <li className="elementBlock"><a href="Contact">About</a></li>
// <li className="elementBlock"><a href="About">Home</a></li>
// <li className="elementSignIn">
//         <span></span>
//         <span></span>
//         <span></span>
//         <span></span>
//         <button className="signinButton" onClick={fortyTwoLogin}>
//         Sign In
//         </button>
//         </li>
// < Header />
// </ul>
