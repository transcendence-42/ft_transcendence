const GameList = (props: any) => {
  return (
    <ul>
      {props.games.map((game: any, index: number) => (
        <li key={index}>
          Game #{game.roomId}
          {game.players.length === 2 && (
            <button
              onClick={props.setRoom({
                id: game.roomId,
                action: props.actionVal.SPECTATE_GAME,
              })}
            >
              Spectate
            </button>
          )}
          {game.players.length === 1 && (
            <button
              onClick={props.setRoom({
                id: game.roomId,
                action: props.actionVal.PLAY_GAME,
              })}
            >
              Join
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GameList;
