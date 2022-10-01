import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';

const WinLose = (props: any) => {

  enum ePlayerStatus {
    WIN = 0,
    LOSE,
    ABANDON,
  }
  
  if (+props.players[0].playerId === +props.id) {
    if (props.players[0].status === ePlayerStatus.WIN) {
      return (
        <div className="badge badge-green" style={{ fontSize: props.size }}>
          WIN
        </div>
      );
    } else {
      return (
        <div className="badge badge-red" style={{ fontSize: props.size }}>
          LOSE
        </div>
      );
    }
  } else {
    if (props.players[1].status === ePlayerStatus.WIN) {
      return (
        <div className="badge badge-green" style={{ fontSize: props.size }}>
          WIN
        </div>
      );
    } else {
      return (
        <div className="badge badge-red" style={{ fontSize: props.size }}>
          LOSE
        </div>
      );
    }
  }
};

export default WinLose;
