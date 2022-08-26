import {useState, useEffect} from "react";
import Play from "./Play"
import './home.css';
import "../Tools/Box.css"
import PongIMG from './Pong.jpg';
import Header from "../../Header"

export default function Home () {
    const [user, setUser] = useState(null);
    const [loginOrRegister, setAuthState]= useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch("http://127.0.0.1:4200/auth/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        }
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201)
            return response.json();
          throw new Error("authentification failed.");
        })
        .then((responseObject) => {
          console.log(
            "this is response from fetch: ",
            JSON.stringify(responseObject, null, 4)
          );
          setUser(responseObject.user);
          setAuthState(responseObject.message);
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);
    return (
        <div className="home" >
          <div className="homeElement">
            <h2 className="pinkText" style={{fontSize: "5vw"}}> ENTER THE PONG CONTEST </h2>
            </div>
            <div className="homeElement">
            <h2 className="blueText" style={{fontSize: "2vw"}}>  Confront other players
                                                                  online and become the best at Pong! </h2>
            </div>
            {/* <div className="homeElementIMG">
              <img src={PongIMG} alt="Pong"/>
            </div> */}
            <div className="homeElement">
            <h2 className="blueText" style={{fontSize: "2vw"}}> Join Players From 42 School </h2>
            </div>

        </div>
    );
}
