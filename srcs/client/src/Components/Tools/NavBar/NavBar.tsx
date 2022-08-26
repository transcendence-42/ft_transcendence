import React, { useContext } from "react"; 
import "./NavBar.css"
import Auth from "../../Context/Auth";

export default function NavBar()
{
  const fortyTwoLogin = () => {

    window.open("http://127.0.0.1:4200/auth/42/register", "_self");
   console.group();
   return (1);
  }
  const {isAuthenticated } = useContext(Auth);

    return (
      <nav>
        <ul>
            <>
            <li className="element" ><a href="Pong">PONG</a></li>
            <li className="elementBlock"><a href="News">Leaderboard</a></li>
            <li className="elementBlock"><a href="Contact">About</a></li>
            <li className="elementBlock"><a href="About">Home</a></li>
            <li className="elementSignIn">
                <a href="Sign in" onClick={fortyTwoLogin}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Sign In
                </a></li>
                </>
        </ul>

        </nav>
    )

}


/* <ul>
{(!isAuthenticated && (
  <>
  <li className="element" ><a href="Pong">PONG</a></li>
  <li className="elementBlock"><a href="News">Leaderboard</a></li>
  <li className="elementBlock"><a href="Contact">About</a></li>
  <li className="elementBlock"><a href="About">Home</a></li>
  <li className="elementSignIn">
      <a href="Sign in" onClick={fortyTwoLogin}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Sign In
      </a></li>
      </>
)) || (
  <>
  <li className="element" ><a href="Pong">PONG</a></li>
  <li className="elementBlock"><a href="News">Leaderboard</a></li>
  <li className="elementBlock"><a href="Contact">About</a></li>
  <li className="elementBlock"><a href="About">Home</a></li>
  <li className="elementSignIn"></li>
  <li className="element" ><a href="Pong">SECRET</a></li>
  <li className="elementBlock"><a href="News">SECRETAUSSI</a></li>
  </>
)}
</ul> */
