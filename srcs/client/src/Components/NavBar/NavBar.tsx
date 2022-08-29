import React, { useContext } from "react"; 
import "./NavBar.css"
import Auth from "../Context/Auth";
import Login from "../../Pages/Login/Login";

export default function NavBar()
{
 
  const {isAuthenticated } = useContext(Auth);

    return (
    <>
  {(!isAuthenticated && (
  <>
      <div className="navBar">
            <a className="elementHome" href="/">PONG</a>
            <a href="login" className="elementSignIn" onClick={Login}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
          </a>
          </div>
      </>
)) || (
  <>
      <div className="navBar">
          <a className="elementHome" href="/">PONG</a>
          <a href="login" className="elementSignIn" onClick={Login}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Welcome
        </a>
      <a className="elementBlock" href="/home">Home</a>
      <a className="elementBlock" href="/about">About</a>
      <a className="elementBlock" href="/chat">Chat</a>
      <a className="elementBlock" href="/leaderboard">Leaderboard</a>
      </div>
  </>
)}
    </>
    )
}




{/* {/* <ul>
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
</ul> 
==========================
<ul>
    {(!isAuthenticated && (
    <>
    <li className="element" ><a href="/">PONG</a></li>
    <li className="elementSignIn">
        <a href="login" onClick={fortyTwoLogin}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
        </a></li>
        </>))
        ||
    (
    <>
    <li className="element" ><a href="Pong">PONG</a></li>
    <li className="elementBlock"><a href="News">Leaderboard</a></li>
    <li className="elementBlock"><a href="Contact">About</a></li>
    <li className="elementBlock"><a href="About">Home</a></li>
    <li className="elementSignIn"></li>
    </>
    )
  }
</ul>
</div> 
*/}





{/* <>
      {(!isAuthenticated && (
        <>
          <div className="navBar">
            <a className="elementHome" href="/">PONG</a>
            <a href="login" className="elementSignIn" onClick={fortyTwoLogin}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
          </a>
          </div>
        </>))
        ||
    (
    <>
      <div className="navBar">
          <a className="elementHome" href="/">PONG</a>
          <a href="login" className="elementSignIn" onClick={fortyTwoLogin}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Welcome
        </a>
      <a className="elementBlock" href="/about">About</a>
      <a className="elementBlock" href="/chat">Chat</a>
      <a className="elementBlock" href="/leaderboard">Leaderboard</a>
      </div>
    </>
    )
  }
    </> */}

