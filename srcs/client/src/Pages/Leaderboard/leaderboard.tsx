import React from 'react';
import { getFetch } from './getFetch';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './leaderboard.css';
import League from '../Profile/League';

export default function Leaderboard() {
  /*
   **  Here we grab the information to display it and sort the Elo Ratings
   */
  let location = useLocation();
  const { userID }: any = location.state || {}; //Destructuring
  console.log(userID);
  const [users, setUsers]: any = useState(null);
  let i = 1;

  useEffect(() => {
    let request = 'http://127.0.0.1:4200/users';
    const json = getFetch({ url: request });
    json.then((responseObject) => {
      setUsers(responseObject);
    });
  }, [userID]);
  /*
   **  Simple display, map is going to sort the elo Ratings
   */
  if (users) {
    return (
      <>
        <h1 className="pinkText " style={{ fontSize: '4vw' }}>
          LEADERBOARD
        </h1>
        <div className="container1 scroll" data-testid="tracker">
          <table className="table">
            <thead>
              <tr className='leaderboard-tr text-center'>
                <th scope="col">RANK</th>
                <th scope="col">NAME</th>
                <th scope="col">ELO</th>
                <th scope="col">LEAGUE</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users
                  .sort((a: { eloRating: any }, b: { eloRating: any }) =>
                    a.eloRating < b.eloRating ? 1 : -1,
                  )
                  .map(
                    (user: {
                      eloRating: string;
                      id: React.Key;
                      username: string;
                    }) => (
                      <tr className='leaderboard-tr text-center' key={user.id}>
                        {userID === user.id ? (
                          <>
                            <td
                              style={{ fontSize: '2vw' }}
                              className="pinkText"
                            >
                              {i++}
                            </td>
                            <td
                              style={{ fontSize: '2vw' }}
                              className="pinkText"
                            >
                              {user.username}
                            </td>
                            <td
                              style={{ fontSize: '2vw' }}
                              className="pinkText"
                            >
                              {user.eloRating}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ fontSize: '2vw' }}>{i++}</td>
                            <td style={{ fontSize: '2vw' }}>{user.username}</td>
                            <td style={{ fontSize: '2vw' }}>
                              {user.eloRating}
                            </td>
                          </>
                        )}
                        <td>
                          <League elo={user.eloRating} size={'2vw'} />
                        </td>
                      </tr>
                    ),
                  )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  return <></>;
}
