import React from 'react';
import '../../Components/Tools/Text.css';
import '../../Components/Tools/Box.css';
import '../../Styles/badges.css';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const OnlineOffline = (props: any) => {
  /**
   * @props   status        : player status
   *          size          : font size
   *          userId        : id of the user which we are displaying status
   *          currentId     : id of the current authenticated user
   *          switchHandler : handler function to change status player
   *          displaySwitch : (true | false) display a switch button if userId
   *                           === currentId
   */

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
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <div className="mt-2 mb-2 text-center w-100">
      {props.status === ePlayerStatus.OFFLINE && (
        <>
          <div className="badge badge-black" style={{ fontSize: props.size }}>
            OFFLINE
          </div>
          {props.displaySwitch && (
            <button
              className="btn btn-dark-pink text-pink"
              onClick={props.switchHandler}
            >
              <VisibilityOutlinedIcon />
            </button>
          )}
        </>
      )}
      {props.status === ePlayerStatus.PLAYING && (
        <div className="badge badge-pink" style={{ fontSize: props.size }}>
          PLAYING
        </div>
      )}
      {props.status === ePlayerStatus.WAITING && (
        <div className="badge badge-orange" style={{ fontSize: props.size }}>
          WAITING
        </div>
      )}
      {props.status !== ePlayerStatus.OFFLINE &&
        props.status !== ePlayerStatus.PLAYING &&
        props.status !== ePlayerStatus.WAITING && (
          <>
            <div className="badge badge-green" style={{ fontSize: props.size }}>
              ONLINE
            </div>
            {props.displaySwitch && (
            <button
              className="btn btn-dark-pink text-pink"
              onClick={props.switchHandler}
            >
              <VisibilityOffOutlinedIcon />
            </button>
          )}
          </>
        )}
    </div>
  );
};

export default OnlineOffline;
