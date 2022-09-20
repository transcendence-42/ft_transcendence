import React from 'react';
import { getFetch } from './getFetch'
import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import './leaderboard.css';

export default function Leaderboard () {
/*
**  Here we grab the information to display it and sort the Elo Ratings
*/
  let location = useLocation();
  const {userID} : any  = location.state || {}; //Destructuring
  const [users, setUsers] : any = useState(null);
  let i = 1;

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
/*
**  Simple display, map is going to sort the elo Ratings 
*/
 if(users)
  {
    return (
      
          <>
            <div className="leaderboard" data-testid="tracker">
              <div>
              <div className='frame'>
                <div>
                  <h1 className="pinkText " style={{fontSize: "4vw"}}>LEADERBOARD</h1>
                </div>
                <div className='container'>
                <div className='blueText' style={{fontSize: "2vw"}}>
                  <h2 className="column" >RANK</h2>
                </div>
                <div className='blueText' style={{fontSize: "2vw"}}>
                    <h2 className="column">NAME</h2>
                </div> 
                <div className='blueText' style={{fontSize: "2vw"}} >
                  <h2 className="column">Elo Ratings</h2>
                </div>
                </div> 
                <div className='container'>
                  <table>
                  <tbody>
                    { 
                     users && users.sort((a: {eloRating: any; },b: {eloRating: any;}) => (a.eloRating) < (b.eloRating) ? 1 : -1)
                    .map((user: {eloRating: string; id: React.Key; username: string; })  =>
                              <tr key={user.id}>
                                  <td style={{fontSize: "2vw"}}>{i++}</td>
                                  <td style={{fontSize: "2vw"}}>{user.username}</td>
                                  <td style={{fontSize: "2vw"}}>{user && user.eloRating}</td>
                              </tr>
                          )}
                    </tbody> 
                  </table>
                </div>
              </div>
              </div>
            </div>
          </>
        );
}
return(<></>);
}