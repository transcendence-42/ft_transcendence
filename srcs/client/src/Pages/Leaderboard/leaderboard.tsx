import './leaderboard.css';
import {getFetch} from './getFetch'
import { useLocation } from "react-router-dom";
import {useState, useEffect } from 'react'
import React from 'react';

export default function Leaderboard () {
  
  let location = useLocation();
  const {userID} : any  = location.state || {}; //Destructuring
  const [users, setUsers] : any = useState(null);

  useEffect(() => {
      console.log('test : ' + userID);
      let request = "http://127.0.0.1:4200/users";
      console.log(request);
      const json = getFetch({url : request});
      json.then((responseObject)=> {
        console.log(responseObject);
        setUsers(responseObject);
      });
  },[userID]);
  if(users)
  {
    return (
      <>
      <div className="leaderboard" data-testid="tracker">
          <div className='frame'>
            <div>
              <h1 className="pinkText " style={{fontSize: "4vw"}}>LEADERBOARD</h1>
            </div>
            <div className='container'>
              {
                users && users.map((user : any, index: number) => (
                <div key={index}>
                <div className='blueText' style={{fontSize: "2vw"}}>
                  <h2>RANK</h2>
                  <div className="item-container"> {user.username}</div>
                <div>

                  </div>
                </div>
                <div className='blueText' style={{fontSize: "2vw"}}>
                  <h2>NAME</h2>
                  <div className="item-container"> {user.username} 
                  </div> 
                </div>
                <div className='blueText' style={{fontSize: "2vw"}} >
                  <h2>WINS</h2>
                  <div className="item-container"> {user.stats && user.stats.wins} 
                  </div>
                </div>
              </div>
                ))} 
            </div>
          </div>
      </div>
           </>
        );
}
return(<></>);
}