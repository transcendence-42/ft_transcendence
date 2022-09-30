import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown';
import WinLose from './WinLose';

const MatchHistory = (props: any) => {
  if (!props.matchesList.length) {
    return (
      <div
        className="blueBoxMatch"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <div className="yellowText" style={{ fontSize: '3vw' }}>
          Matches History
        </div>
        <div
          className="blueTextMatch"
          style={{ fontSize: '2vw', marginTop: '3vh' }}
        >
          Play a Game first
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="blueBoxMatch"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <div className="yellowText" style={{ fontSize: '3vw' }}>
          Matches History
        </div>
        <table className="table scroll m-1 align-middle  ">
          <tbody>
            {props.matchesList.map(
              (matches: any, index: number) =>
                index < 10 && (
                  <tr key={index} style={{ fontSize: '2vw' }}>
                    <td>
                      <PhotoProfilDropdown
                        url={matches.players[0].player.profilePicture}
                        id={matches.players[0].playerId}
                        originalId={props.originalId}
                        width={'4vw'}
                        height={'4vw'}
                      />
                    </td>
                    <td colSpan={2}>
                      <table>
                        <tbody>
                          <tr>
                            <td className="text-blue text-center">
                              {matches.players[0].player.username}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-blue text-center">
                              {matches.players[0].score}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="pinkText"> VS </td>
                    <td colSpan={2}>
                      <table>
                        <tbody>
                          <tr>
                            <td className="text-blue text-center">
                              {matches.players[1].player.username}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-blue text-center">
                              {matches.players[1].score}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <PhotoProfilDropdown
                        url={matches.players[1].player.profilePicture}
                        id={matches.players[1].playerId}
                        originalId={props.originalId}
                        width={'4vw'}
                        height={'4vw'}
                      />
                    </td>
                    <td>
                      <WinLose
                        size={'2vw'}
                        id={props.id}
                        players={matches.players}
                      />
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    );
  }
};

export default MatchHistory;
