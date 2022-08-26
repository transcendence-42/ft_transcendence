import React from "react";
import "./NavBar.css"
import Header from "../../../Header"
import "../Text.css"

export default function NavBar()
{
     const fortyTwoLogin = () => {
    window.open("http://127.0.0.1:4200/auth/42/register", "_self");

     }
    return (
        <div className="navBar">
        <div className="pongInNavBar">
          <h1> Un </h1>
        </div>
        <div className="menuInNavBar">
          <div className="boutonsInNavBar">
            {/* <h2 className="yellowText" style={{fontSize: "50px"}} > ABCD </h2> */}
            About
         </div>
          <div className="boutonsInNavBar"> Home </div>
          <div className="boutonsInNavBar"> SignIn </div>
        </div>
      </div>
    )
}

// export default function NavBar()
// {
//      const fortyTwoLogin = () => {
//     window.open("http://127.0.0.1:4200/auth/42/register", "_self");
//      }
//     return (
//         <ul>
//             <li className="element" ><a href="Pong">PONG</a></li>
//             <li className="elementBlock"><a href="News">Leaderboard</a></li>
//             <li className="elementBlock"><a href="Contact">About</a></li>
//             <li className="elementBlock"><a href="About">Home</a></li>
//             <li className="elementSignIn">
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                     <button className="signinButton" onClick={fortyTwoLogin}>
//                     Sign In
//                     </button>
//                     </li>
//             < Header />
//         </ul>
//     )

// }
