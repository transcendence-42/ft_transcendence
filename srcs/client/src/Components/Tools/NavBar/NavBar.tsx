import React from "react";
import "./NavBar.css"
import "./ProfilNavBar.tsx"
import "../Text.css"
import ProfilNavBar from "./ProfilNavBar"
import SignIn from "./SignIn"

export default function NavBar(props: any)
{
    if (props.authorize)
    {
        return (
            <div className="navBar">
            <div className="menuInNavBar">
            <div className="buttonInNavBar">
            <a  href="/"> <h2 className="blueText"> PONG </h2> </a>
             </div>
              <div className="buttonInNavBar">
              <a  href="/home"> <h2 className="yellowText"  > Home </h2> </a>
                
             </div>
             <div className="buttonInNavBar">
             <a  href="/about"><h2 className="yellowText" > About </h2> </a>
             </div>
             <div className="buttonInNavBar">
                <h2 className="yellowText" > Chat </h2>
             </div>
             <div className="buttonInNavBar">
                 <h2 className="yellowText" > Leaderboard </h2>
             </div>
             <div className="buttonInNavBar">
                <ProfilNavBar />
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
