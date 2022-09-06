const GameList = (props: any) => {

  return (
    <div>
      {
        props.games.length > 0
        ?
        <ul>
          {props.games.map((game: any, index: number) => (
            <li key={index}>
              Game #{game.roomId}
              {game.players.length === 2 && (
                <button
                  onClick={() => props.setRoom({
                    id: game.roomId,
                    action: props.actionVal.VIEW_GAME,
                  })}
                >
                  Spectate
                </button>
              )}
              {game.players.length === 1 && (
                <button
                  onClick={() => props.setRoom({
                    id: game.roomId,
                    action: props.actionVal.JOIN_GAME,
                  })}
                >
                  Join
                </button>
              )}
            </li>
          ))}
        </ul>
        :
        <p>No games...</p>
      }
      <button onClick={props.handleNewGame}>Create New Game</button>
    </div>
  );
};

export default GameList;
