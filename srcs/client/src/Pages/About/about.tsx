import {useState, useEffect} from "react";
import "../About/about.css"


export default function About () {
    const [user, setUser] = useState(null);
    const [loginOrRegister, setAuthState]= useState(null);

    return (
        <> 
        <div className="about">
          <p className="text">ABOUT US</p>
          </div>
        </>
    );
}
