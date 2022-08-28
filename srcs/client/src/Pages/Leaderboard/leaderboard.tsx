import {useState, useEffect} from "react";
import './leaderboard.css';
import "../../Components/Tools/Box.css"


export default function Leaderboard () {
    const [user, setUser] = useState(null);
    const [loginOrRegister, setAuthState]= useState(null);

    return (
        <> 
        <div className="leaderboard">
          <p className="text">LEADERBOARD</p>
          </div>
        </>
    );
}
