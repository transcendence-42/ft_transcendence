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
    <div className="mt-2 mb-2 text-center w-100">
      {props.status === ePlayerStatus.OFFLINE && (
        <div className="badge badge-black" style={{ fontSize: props.size }}>
          OFFLINE
        </div>
      )}
      {props.status === ePlayerStatus.PLAYING && (
        <div className="badge badge-pink" style={{ fontSize: props.size }}>
          PLAYING
        </div>
      )}
      {props.status !== ePlayerStatus.OFFLINE &&
        props.status !== ePlayerStatus.PLAYING && (
          <div className="badge badge-green" style={{ fontSize: props.size }}>
            ONLINE
          </div>
        )}
    </div>
  );
};

export default OnlineOffline;
