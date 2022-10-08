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
  const [users, setUsers]: any = useState([]);
  let i = 1;

  useEffect(() => {
    const apiUrl: string = process.env.REACT_APP_API_URL as string;
    let request = `${apiUrl}/users`;
    const json = getFetch({ url: request });
    json.then((responseObject) => {
      setUsers(responseObject);
    });
  }, [userID]);
  /*
   **  Simple display, map is going to sort the elo Ratings
   */

   return (
      <>
        <h1 className="pinkText " style={{ fontSize: '2em' }}>
          LEADERBOARD
        </h1>
        <div className="row">
        <div className="container1 scroll col-10 col-sm-8 col-md-7 col-lg-6 col-xl-5" data-testid="tracker">
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
              {users && users.length > 0 &&
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
                              style={{ fontSize: '1.2em' }}
                              className="pinkText"
                            >
                              {i++}
                            </td>
                            <td
                              style={{ fontSize: '1.2em' }}
                              className="pinkText"
                            >
                              {user.username}
                            </td>
                            <td
                              style={{ fontSize: '1.2em' }}
                              className="pinkText"
                            >
                              {user.eloRating}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ fontSize: '1.2em' }}>{i++}</td>
                            <td style={{ fontSize: '1.2em' }}>{user.username}</td>
                            <td style={{ fontSize: '1.2em' }}>
                              {user.eloRating}
                            </td>
                          </>
                        )}
                        <td>
                          <League elo={user.eloRating} size={'1.2em'} />
                        </td>
                      </tr>
                    ),
                  )}
                  {
                    users && users.length === 0 &&
                    <tr className='text-center'>
                      <td style={{ fontSize: '1.2em' }} className="pinkText" colSpan={4}>
                        No user yet on the leaderboard :(
                      </td>
                    </tr>
                  }
            </tbody>
          </table>
        </div>
        </div>

      </>
    );
}
