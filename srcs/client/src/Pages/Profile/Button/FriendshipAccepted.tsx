import React from 'react';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import '../profile.css';
import { updateFriendship } from '../Fetch/updateFriendship';

const FriendshipAccepted = (props: any) => {
  enum eFriendshipStatus {
    REQUESTED = 0,
    ACCEPTED,
    REJECTED,
  }

  function onClickAccepted() {
    const apiUrl: string = process.env.REACT_APP_GAME_SOCKET_URL;
    updateFriendship({
      url: `${apiUrl}/friendship`,
      addresseeId: props.addresseeId,
      requesterId: props.requesterId,
      status: eFriendshipStatus.ACCEPTED,
    });
    props.up();
  }

  return (
    <button
      className="btn btn-blue text-blue"
      style={{ fontSize: '0.8em' }}
      onClick={() => onClickAccepted()}
    >
      Accept
    </button>
  );
};

export default FriendshipAccepted;
