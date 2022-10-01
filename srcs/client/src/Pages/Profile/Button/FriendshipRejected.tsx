import React from 'react';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import '../profile.css';
import { updateFriendship } from '../Fetch/updateFriendship';

const FriendshipRejected = (props: any) => {
  enum eFriendshipStatus {
    REQUESTED = 0,
    ACCEPTED,
    REJECTED,
  }

  function onClickAccepted() {
    updateFriendship({
      url: 'http://127.0.0.1:4200/friendship',
      addresseeId: props.addresseeId,
      requesterId: props.requesterId,
      status: eFriendshipStatus.REJECTED,
    });
    props.up();
  }

  return (
    <button
      className="btn btn-pink text-pink"
      style={{ fontSize: '0.8em' }}
      onClick={() => onClickAccepted()}
    >
      Reject
    </button>
  );
};

export default FriendshipRejected;
