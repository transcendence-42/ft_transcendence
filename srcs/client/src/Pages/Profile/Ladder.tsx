import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import League from './League';
import './profile.css';

export default function Ladder(props: any) {
  return (
    <div className="boxLadder">
      <div
        className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center me-2"
        style={{
          width: '8vw',
          height: '8vw',
        }}
      >
        <div className="text-blue" style={{ fontSize: '1.2vw' }}>
          League
        </div>
        <div className="" style={{ fontSize: '1.3vw' }}>
          <League elo={props.elo} />
        </div>
      </div>
      <div
        className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center me-2"
        style={{
          width: '8vw',
          height: '8vw',
        }}
      >
        <div className="text-blue" style={{ fontSize: '1.2vw' }}>
          WINS
        </div>
        <div className="text-pink" style={{ fontSize: '2vw' }}>
          {props.stats ? props.stats.wins : '0'}
        </div>
      </div>

      <div
        className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center"
        style={{
          width: '8vw',
          height: '8vw',
        }}
      >
        <div className="text-blue" style={{ fontSize: '1.2vw' }}>
          LOSES
        </div>
        <div className="text-pink" style={{ fontSize: '2vw' }}>
          {props.stats ? props.stats.losses : '0'}
        </div>
      </div>
    </div>
  );
}
