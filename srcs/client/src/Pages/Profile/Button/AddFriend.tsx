import React, { useContext, useEffect, useState } from 'react';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import '../profile.css';
import { requestFriendship } from '../Fetch/requestFriendship';
import GroupIcon from '@mui/icons-material/Group';
import { RootModalsContext } from '../../RootModals/RootModalsProvider';

const AddFriend = (props: any) => {
  /**
   * @props   id          : id of the user we are looking at
   *          originalId  : if of the currently authenticated user
   *          friendList  : friend list of the user we are looking at
   */

  const apiUrl: string = process.env.REACT_APP_API_URL as string;
	const url = `${apiUrl}/users/${props.originalId}/friends`;

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  const [isFriend, setIsFriend] = useState(false);
  const [btnMessage, setBtnMessage] = useState('Add friend');
  
  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    if (
      props.friendList.find((f: any) => f.id === props.originalId) !== undefined
    ) {
      setIsFriend(true);
    } else setIsFriend(false);
  }, [props.friendList, props.originalId]);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const sendRequest = (data: any) => {
    requestFriendship(data);
    setBtnMessage('✅ Request sent !');
    setTimeout(() => {
      setBtnMessage('Add friend');
    }, 2000);
  }

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <>{!isFriend &&
      <button
        className="btn btn-blue text-blue"
        style={{
          width: '100%',
          height: 'auto',
        }}
        onClick={() => sendRequest({ url: url, addresseeId: props.id })}
      >
        <div style={{ fontSize: '0.8em' }}>{btnMessage}</div>
      </button>}
      {isFriend &&
        <div className="text-blue" style={{ fontSize: '0.8em' }}>
          <GroupIcon /> you are friends !
        </div>
      }
    </>
  );
};

export default AddFriend;
