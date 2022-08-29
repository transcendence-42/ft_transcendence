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
                <h2 className="yellowText" > Chat </h2>
             </div>
             <div className="boutonsInNavBar">
                 <h2 className="yellowText" > Leaderboard </h2>
             </div>
             <div className="boutonsInNavBar">
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
}
