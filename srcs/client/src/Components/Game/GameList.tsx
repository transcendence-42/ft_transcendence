import './Game.css'

const GameList = (props: any) => {
  const defaultPic: string = "https://static.vecteezy.com/ti/vecteur-libre/p1/1991212-avatar-profile-pink-neon-icon-brick-wall-background-color-neon-vector-icon-vectoriel.jpg"
  return (
    <div>
      <h3 className="text-pink text-start">Active games</h3>
      {props.gameList.length > 0 ? (
        <table className="table table-borderless" style={{ listStyleType: "none" }}>
          <tbody>
          {props.gameList.map((game: any, index: number) => (
            <tr key={index} className="text-pink border-blue">
              {game.players[0] &&
              <>
                <td className="align-middle text-right">
                  {game.players[0].name}
                </td>
                <td className="align-middle">
                  <img src={game.players[0].pic || defaultPic} width={50} height={40} className="img-circle" alt="p1"/>
                </td>
                <td className="align-middle text-blue fs-4">
                  {game.players[0].score || 0}
                </td>
              </>}
              <td className="align-middle">/</td>
              {game.players[1] ?
              <>
                <td className="align-middle text-blue fs-4">
                  {game.players[1].score || 0}
                </td>
                <td className="align-middle">
                  <img src={game.players[1].pic || defaultPic} width={50} height={40} className="img-circle" alt="p2"/>
                </td>
                <td className="align-middle">
                  {game.players[1].name}
                </td>
              </>
              : <><td className="align-middle text-blue fs-4">0</td><td className="align-middle"><img src={defaultPic} width={50} height={40} className="img-circle" alt="p2"/></td><td className="align-middle">...</td></>}
              <td>
                <button className="btn btn-blue text-blue"
                  onClick={() =>
                    props.setGame({
                      id: game.id,
                      action: props.actionVal.VIEW_GAME,
                    })
                  }
                >
                  Spectate
                </button>
              </td>
              <td>
                {game.players.length === 1 && (
                  <button className="btn btn-blue text-blue"
                    onClick={() =>
                      props.setGame({
                        id: game.id,
                        action: props.actionVal.JOIN_GAME,
                      })
                    }
                  >
                    Join
                  </button>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <table className="table table-borderless" style={{ listStyleType: "none" }}>
          <tbody>
            <tr>
              <td className="align-middle border-blue"><h5 className="text-blue">No games...</h5></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GameList;
