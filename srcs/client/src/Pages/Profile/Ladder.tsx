import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import League from './League';
import './profile.css';

export default function Ladder(props: any) {
  return (
    <div className="row">
      <div className="col d-flex flex-row justify-content-center w-100">
      
        {/* League */}
        <div
          className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center me-2"
          style={{
            width: '100px',
            height: '100px',
          }}
        >
          <span className="text-blue" style={{ fontSize: '1em' }}>
            League
          </span>
          <League elo={props.elo} size={'1.2em'} />
        </div>

        {/* Wins */}
        <div
          className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center me-2"
          style={{
            width: '100px',
            height: '100px',
          }}
        >
          <div className="text-blue" style={{ fontSize: '1em' }}>
            WINS
          </div>
          <div className="text-pink" style={{ fontSize: '2em' }}>
            {props.stats ? props.stats.wins : '0'}
          </div>
        </div>

        {/* Loses */}
        <div
          className="rounded-circle box-blue d-flex flex-column align-items-center justify-content-center"
          style={{
            width: '100px',
            height: '100px',
          }}
        >
          <div className="text-blue" style={{ fontSize: '1em' }}>
            LOSES
          </div>
          <div className="text-pink" style={{ fontSize: '2em' }}>
            {props.stats ? props.stats.losses : '0'}
          </div>
        </div>

      </div>
    </div>
  );
}
