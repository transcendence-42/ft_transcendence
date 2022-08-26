import React from "react";
import "./NavBar.css"
import "./SignIn.tsx"
import "../Text.css"
import SignIn from "./SignIn"

export default function NavBar()
{
    return (
        <div className="navBar">
        <div className="menuInNavBar">
        <div className="boutonsInNavBar">
            <h2 className="blueText"> PONG </h2>
         </div>
          <div className="boutonsInNavBar">
            <h2 className="yellowText" > Home </h2>
         </div>
         <div className="boutonsInNavBar">
            <h2 className="yellowText" > About </h2>
         </div>
         <div className="boutonsInNavBar">
             <h2 className="yellowText" > Leaderboard </h2>
         </div>
         <div className="boutonsInNavBar">
            <SignIn />
        </div>
        </div>
      </div>
    )
}
