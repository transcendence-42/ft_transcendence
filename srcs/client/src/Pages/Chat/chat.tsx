import {useState, useEffect} from "react";
import './chat.css';
import "../../Components/Tools/Box.css"


export default function Chat () {
    const [user, setUser] = useState(null);
    const [loginOrRegister, setAuthState]= useState(null);

    return (
      <> 
      <div className="chat">
        <p className="text">Chat</p>
        </div>
      </>
    );
}

