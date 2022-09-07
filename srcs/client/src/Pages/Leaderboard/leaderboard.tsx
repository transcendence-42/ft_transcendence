import './leaderboard.css';
import {getFetch} from './getFetch'
import { useLocation } from "react-router-dom";
import {useState, useEffect } from 'react'
import React from 'react';
import { render } from '@testing-library/react';

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
  let i = 1;

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
                  <h2 className="column">WINS</h2>
                </div>
                </div> 
                <div className='container'>
                  <table>
                  <tbody>
                    { 
                     users &&
                    users.sort((a: {
                      wins: any; stats: { wins: any; }; },b: {wins: any; stats: { wins: any; };}) => (a.stats && a.stats.wins) < (b.stats && b.stats.wins) ? 1 : -1)
                    .map((user: { id: React.Key; username: string ; stats: { wins: any; }; })  =>
                              <tr key={user.id}>
                                  <td style={{fontSize: "2vw"}}>{i++}</td>
                                  <td style={{fontSize: "2vw"}}>{user.username}</td>
                                  <td style={{fontSize: "2vw"}}>{user.stats && user.stats.wins}</td>
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

{/* <tbody>
{ users &&
users.sort((a: { id: number; },b: { id: number; }) =>a.id > b.id ? a : -1)
.map((user: { id: React.Key; username: string ; stats: { wins: any; }; })  =>
          <tr key={user.id}>
              <td style={{fontSize: "2vw"}}>{user.id}</td>
              <td style={{fontSize: "2vw"}}>{user.username}</td>
              <td style={{fontSize: "2vw"}}>{user.stats && user.stats.wins}</td>
          </tr>
      )}
</tbody> */}

// FOR WINS
{/* <tbody>
{ 
 users &&
users.sort((a: {
  wins: any; stats: { wins: any; }; },b: {wins: any; stats: { wins: any; };}) => a.wins > b.wins ? 1 : -1)
.map((user: { id: React.Key; username: string ; stats: { wins: any; }; })  =>
          <tr key={user.id}>
              <td style={{fontSize: "2vw"}}>{user.id}</td>
              <td style={{fontSize: "2vw"}}>{user.username}</td>
              <td style={{fontSize: "2vw"}}>{user.stats && user.stats.wins}</td>
          </tr>
      )}
</tbody> */}