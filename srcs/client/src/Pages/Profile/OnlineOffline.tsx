import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import '../../Styles/badges.css';

const OnlineOffline = (props: any) => {
  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum ePlayerStatus {
    OFFLINE = 0,
    ONLINE,
    WAITING,
    PLAYING,
    SPECTATING,
    CHALLENGE,
  }

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <>
      {props.status === ePlayerStatus.OFFLINE && (
        <div className="badge badge-black" style={{ fontSize: props.size }}>
          {' '}
          OFFLINE{' '}
        </div>
      )}
      {props.status === ePlayerStatus.ONLINE && (
        <div className="badge badge-green" style={{ fontSize: props.size }}>
          {' '}
          ONLINE{' '}
        </div>
      )}
      {props.status === ePlayerStatus.WAITING && (
        <div className="badge badge-blue" style={{ fontSize: props.size }}>
          {' '}
          WAITING FOR AN OPPONENT{' '}
        </div>
      )}
      {props.status === ePlayerStatus.PLAYING && (
        <div className="badge badge-pink" style={{ fontSize: props.size }}>
          {' '}
          PLAYING{' '}
        </div>
      )}
      {props.status === ePlayerStatus.SPECTATING && (
        <div
          className="badge badge-orange"
          style={{ fontSize: props.size }}
        >
          {' '}
          SPECTATING{' '}
        </div>
      )}
      {props.status === ePlayerStatus.CHALLENGE && (
        <div
          className="badge badge-red"
          style={{ fontSize: props.size }}
        >
          {' '}
          CHALLENGING{' '}
        </div>
      )}
    </>
  );
};

export default OnlineOffline;
