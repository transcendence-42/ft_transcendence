import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown';
import WinLose from './WinLose';

const MatchHistory = (props: any) => {
  if (!props.matchesList.length) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <h3 className="text-pink text-start">Matches History</h3>
        <table className="table table-borderless scroll m-1 align-middle match-history mb-3">
          <tbody>
            <tr className="border-blue w-100" style={{ fontSize: '1.2em' }}>
              <td className="text-blue mt-3" style={{ textAlign: 'left' }}>
                Play a Game first
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <h3 className="text-pink text-start">Matches History</h3>
        <table className="table table-borderless scroll m-1 align-middle match-history mb-3">
          <tbody>
            {props.matchesList.map(
              (matches: any, index: number) =>
                index < 10 && (
                  <tr
                    className="border-blue w-100"
                    key={index}
                    style={{ fontSize: '1.2em' }}
                  >
                    <td className="text-end">
                      <PhotoProfilDropdown
                        url={matches.players[0].player.profilePicture}
                        id={matches.players[0].playerId}
                        originalId={props.originalId}
                        width={'50px'}
                        height={'50px'}
                      />
                    </td>
                    <td
                      className={`${
                        matches.players[0].playerId === props.id
                          ? 'text-blue'
                          : 'text-pink'
                      } text-center`}
                    >
                      {matches.players[0].player.username}
                    </td>
                    <td className="text-blue text-center">
                      {matches.players[0].score}
                    </td>
                    <td className='text-center'>
                      <WinLose
                        size={'0.6em'}
                        id={props.id}
                        players={matches.players}
                      />
                    </td>
                    <td className="text-blue text-center">
                      {matches.players[1].score}
                    </td>
                    <td
                      className={`${
                        matches.players[1].playerId === props.id
                          ? 'text-blue'
                          : 'text-pink'
                      } text-center`}
                    >
                      {matches.players[1].player.username}
                    </td>
                    <td>
                      <PhotoProfilDropdown
                        url={matches.players[1].player.profilePicture}
                        id={matches.players[1].playerId}
                        originalId={props.originalId}
                        width={'50px'}
                        height={'50px'}
                      />
                    </td>
                    <td></td>
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
