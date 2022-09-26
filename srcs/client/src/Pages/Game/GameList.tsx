import './Game.css';
import '../../Styles';


const GameList = (props: any) => {
  const defaultPic: string = '/img/default-user.jpg';
  return (
    <div>
      <h3 className="text-pink text-start">Active games</h3>
      {props.gameList.length > 0 ? (
        <table
          className="table table-borderless game-list"
          style={{ listStyleType: 'none' }}
        >
          <tbody>
            {props.gameList.map((game: any, index: number) => (
              <tr key={index} className="text-pink border-blue">
                {game.players[0] && (
                  <>
                    <td className="align-middle text-end">
                      {game.players[0].name}
                    </td>
                    <td className="align-middle">
                      <img
                        src={game.players[0].pic || defaultPic}
                        width={50}
                        height={40}
                        className="rounded-circle"
                        alt="p1"
                      />
                    </td>
                    <td className="align-middle text-blue fs-4 text-end">
                      {game.players[0].score || 0}
                    </td>
                  </>
                )}
                <td className="align-middle text-blue fs-4">-</td>
                <td className="align-middle text-blue fs-4 text-start">
                  {(game.players[1] && game.players[1].score) || 0}
                </td>
                <td className="align-middle">
                  <img
                    src={(game.players[1] && game.players[1].pic) || defaultPic}
                    width={50}
                    height={40}
                    className="rounded-circle"
                    alt="p2"
                  />
                </td>
                <td className="align-middle text-start">
                  {(game.players[1] && game.players[1].name) || (
                    <button
                      className="btn btn-pink text-pink"
                      onClick={() =>
                        props.setGame({
                          id: game.id,
                          action: props.event.JOIN_GAME,
                        })
                      }
                    >
                      Join
                    </button>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-blue text-blue"
                    onClick={() =>
                      props.setGame({
                        id: game.id,
                        action: props.event.VIEW_GAME,
                      })
                    }
                  >
                    Spectate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table
          className="table table-borderless"
          style={{ listStyleType: 'none' }}
        >
          <tbody>
            <tr>
              <td className="align-middle border-blue">
                <h5 className="text-blue">No games...</h5>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GameList;
