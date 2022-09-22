import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css"
import ProfilNavBar from "../Button/ProfilNavBar";
import "../Text.css"
import '../Box.css';
import { Link } from "react-router-dom";
import Context from "../../../Context/Context";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { HiUser } from "react-icons/hi";



export default function NavBar ()
{
    const [fromAuth, setFromAuth] = useState(false);
    const [userID, setUserID] = useState<number>(1);
    const contextValue = useContext(Context);   
    /*
    /*
    ** Fetching data and allow the user to connect using "useState" to true
    */
    const getUser = async () => {
        await  fetch("http://127.0.0.1:4200/auth/success", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
            }
        })
        .then((response) => {
            if(!response.ok)
            {
                console.log("!response");
                throw new Error('Fail parsing 42auth you probably denied auth42');
            }
            if (response.status === 200)
            {
                console.log("response 200");
                return response.json();
            }
            else if (response.status === 403)
            {
                console.log("response 403");
                return Promise.reject();

            }
            throw console.log("Fail parsing 42auth");
        })
        .then((responseObject) => {
            if (responseObject.message)
            {
                console.log(responseObject);
                console.log("Success parsing 42auth");
              
                localStorage.setItem("pathIsFree", JSON.stringify(true));
                contextValue.updateIsConnected(true);
                return;
            }
            throw new Error('Something went wrong');
        })
        .catch((err) => console.log(err));
    };

    /*
    ** Fetching data for logout
    */
    const deco = () => {
        fetch("http://127.0.0.1:4200/auth/logout", {
         method: "GET",
         credentials: "include",
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json",
           "Access-Control-Allow-Credentials": "true",
         }
       })
         .then((response) => {
                 return response.json();
         })
         .then((responseObject) => {
            console.log(responseObject)
            if (responseObject.message)
            {
                console.log("Disconnect from our services");
                localStorage.removeItem('pathIsFree');
                contextValue.updateIsConnected(false);
                return;
            }
         })
         .catch((err) => console.log(err));
     };

    /*
    ** Here this function allows us to fetch our first data and start the connection flow only if we are from auth42 page
    */
    

    if (contextValue.isConnected)
    {
        return (
            <Navbar className="navbar bg-dark pt-5 px-5 " bg="transparent" variant="transparent"  expand="lg" collapseOnSelect data-testid="LeaderboardLink">
            
            <Link to="/" >
                    <span className="span1"></span><span className="span1"></span><span className="span1"></span><span className="span1"></span>
                    <h2 className="blueText px-2" data-testid="HomeLink"> PONG</h2>
                    </Link>
            <Navbar.Toggle className="" />
                <Navbar.Collapse className="">
                <Nav className="navbar-nav ms-auto ">
                    <Nav.Link className="" >
                        <span></span><span></span><span></span><span></span>
                        <Link to="/leaderboard"> <h2 className="yellowText">Leaderboard</h2> </Link>
                    </Nav.Link>
                    <Nav.Link className=""  >
                        <span></span><span></span><span></span><span></span>
                        <Link to="/chat">  <h2 className="yellowText" > Chat </h2> </Link>
                    </Nav.Link>
                    <Nav.Link className=""  >
                        <span></span><span></span><span></span><span></span>
                        <Link to="/profile">  <h2 className="yellowText"> Profile </h2> </Link>
                    </Nav.Link>
                    <Nav.Link className="" >
                        <span></span><span></span><span></span><span></span>
                        <Link to="/" onClick={deco}>  <h2 className="yellowText"  style={{animation:"flicker 2.5s infinite alternate"}}>logout </h2> </Link>
                    </Nav.Link>
                </Nav>
                </Navbar.Collapse>
       
    </Navbar>
        )
    }
    else
    {
        return (
        <Navbar className="navbar bg-dark pt-5 pb-4 px-5" bg="transparent" variant="transparent"  expand="md" collapseOnSelect>
                <Link to="/">
                    <span className="span1"></span><span className="span1"></span><span className="span1"></span><span className="span1"></span>
                    <h2 className="blueText px-2" data-testid="HomeLink"> PONG</h2>
                    </Link>
            <Navbar.Toggle className="" />
                <Navbar.Collapse className="">
                <Nav className="navbar-nav ms-auto ">
                    <Nav.Link className="">
                        <span></span><span></span><span></span><span></span>
                        <Link to="/leaderboard"> <h2 className="yellowText" data-testid="LeaderboardLink">Leaderboard</h2> </Link>
                    </Nav.Link>
                    <Nav.Link className="" >
                        <span></span><span></span><span></span><span></span>
                        <Link to="/login">  <h2 className="yellowText" > Login </h2> </Link>
                    </Nav.Link>
                </Nav>
                </Navbar.Collapse>
        </Navbar>
        )
    }
}





{/* <nav className="navbar navbar-dark bg-dark navbar-expand-md">
                <div className="container">
                    <div className="navbar-brand">
                        <Link to="/">
                            <h2 className="blueText" data-testid="HomeLink"> PONG</h2>
                        </Link>
                    </div>
                <div className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#fullMenu" >
                    <span className="navbar-toggler-icon"></span>
                </div>
                    <div className="collapse navbar-collapse" id="fullMenu">
                        <ul className="navbar-nav">
                            <li >
                                <Link to="/" className="">   <h2 className="yellowText" > Home </h2> </Link>
                            </li>
                            <div className="nav-item">
                                <Link to="/about">   <h2 className="yellowText" > About </h2> </Link>
                            </div>
                            <div className="nav-item">
                                <Link to="/leaderboard"> <h2 className="yellowText" data-testid="LeaderboardLink">Leaderboard</h2> </Link>
                            </div>
                            <div className="nav-item">
                                <Link to="/login">  <h2 className="yellowText" > Login </h2> </Link>
                            </div>
                        </ul>
                
            </div>
            </div>
        </nav> */}




    //     <Navbar className="navbar" bg="transparent" variant="transparent"sticky="top" expand="md" collapseOnSelect>
    //     <Navbar.Brand>
    //         <Link to="/"><h2 className="blueText" data-testid="HomeLink"> PONG</h2></Link>
    //     </Navbar.Brand>
    //     <Navbar.Toggle className="coloring" />
    //         <Navbar.Collapse>
    //         <Nav>
    //             <Nav.Link >
    //                 <Link to="/" className="">   <h2 className="yellowText" > Home </h2></Link>
    //             </Nav.Link>
    //             <Nav.Link >
    //                 <Link to="/leaderboard"> <h2 className="yellowText" data-testid="LeaderboardLink">Leaderboard</h2> </Link>
    //             </Nav.Link>
    //             <Nav.Link >
    //                 <Link to="/login">  <h2 className="yellowText" > Login </h2> </Link>
    //             </Nav.Link>
    //             <NavDropdown title="LOGIN">
    //                 <NavDropdown.Item href="#products/profile">Profil</NavDropdown.Item>
    //                 <NavDropdown.Item href="#products/chocolate">Edit Profil</NavDropdown.Item>
    //                 <NavDropdown.Divider />
    //                 <NavDropdown.Item href="#products/promo">Disconnect</NavDropdown.Item>
    //             </NavDropdown>
    //         </Nav>
    //         </Navbar.Collapse>
    // </Navbar>


    // FORMER CO
    // <nav className="navbar navbar-expand-md bg-dark">
    //             <div className="">
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/"> <h2 className="blueText">PONG</h2> </Link>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/home"> <h2 className="yellowText"  >Home</h2> </Link>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/about"><h2 className="yellowText" >About</h2> </Link>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/chat">  <h2 className="yellowText" >Chat</h2> </Link>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/leaderboard">  <h2 className="yellowText" >Leaderboard</h2> </Link>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <button onClick={deco} className="playFlickering">Logout</button>
    //                 </div>
    //                 <div className="buttonInNavBar">
    //                     <Link  to="/profile" state={{userID}}> <ProfilNavBar /> </Link>
    //                 </div>
    //             </div>
    //       </nav>