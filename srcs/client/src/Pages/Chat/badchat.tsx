// import { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../Components/Tools/Box.css';
import './chat.css';
import React from 'react';
import { useState } from 'react';
import PongAdvancedModal from '../../Components/Modal/PongAdvancedModal';
import BrowseChannels from './BrowseChannels';
import CreateChannel from './CreateChannel';
import FriendList from './FriendList';

const Chat = () => {
  // state
  const [showBrowseChannel, setShowBrowseChannel] = useState(false);
  const [showCreateChannel, setshowCreateChannel] = useState(false);
  const [showFriendList, setshowFriendList] = useState(false);

  // handlers
  const handleCloseCreateChannel = () => setshowCreateChannel(false);
  const handleShowCreateChannel = () => setshowCreateChannel(true);

  const handleCloseBrowseChannel = () => setShowBrowseChannel(false);
  const handleShowBrowseChannel = () => setShowBrowseChannel(true);

  const handleCloseFriendList = () => setshowFriendList(false);
  const handleShowFriendList = () => setshowFriendList(true);

  return (
    <>
      <PongAdvancedModal
        title="Browse channels"
        show={showBrowseChannel}
        closeHandler={handleCloseBrowseChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseBrowseChannel}
        textBtn2="Validate"
        handleBtn2={handleCloseBrowseChannel}>
        <BrowseChannels />
      </PongAdvancedModal>
      <PongAdvancedModal
        title="Create a channel"
        show={showCreateChannel}
        closeHandler={handleCloseCreateChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseCreateChannel}
        textBtn2="Create"
        handleBtn2={handleCloseCreateChannel}>
        <CreateChannel />
      </PongAdvancedModal>
      <PongAdvancedModal
        title="Select a friend"
        show={showFriendList}
        closeHandler={handleCloseFriendList}
        textBtn1="Cancel"
        handleBtn1={handleCloseFriendList}
        textBtn2="Validate"
        handleBtn2={handleCloseFriendList}>
        <FriendList />
      </PongAdvancedModal>
      <div className="row row-color main-row-margin">
        <div className="col-2 rounded-4 vh-100 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="yellow-titles titles-position">CHANNELS</p>
            </div>
            <div className="col">
              <button
                className="float-end rounded-4 dropdown-toggle color-dropdown channel-button titles-position"
                data-bs-toggle="dropdown"
                aria-expanded="false"></button>
              <ul className="dropdown-menu channel-menu blue-box-chat">
                <li className="dropdown-item" onClick={handleShowBrowseChannel}>
                  Browse channels
                </li>
                <li className="dropdown-item" onClick={handleShowCreateChannel}>
                  Create a channel
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col overflow-auto scroll-bar">
              <p>Channel name</p>
              <p>Channel name</p>
              <p>Channel name</p>
              <p>Channel name</p>
              <p>Channel name</p>
              <p>Channel name</p>
              <p>Channel name</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="yellow-titles titles-position">MESSAGES</p>
            </div>
            <div className="col">
              <button
                className="message-button float-end rounded-4 titles-position"
                onClick={handleShowFriendList}>
                +
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col overflow-auto scroll-bar">
              <p>Message</p>
              <p>Message</p>
              <p>Message</p>
              <p>Message</p>
              <p>Message</p>
              <p>Message</p>
              <p>Scroll</p>
            </div>
          </div>
        </div>
        <div className="col-8 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles channel-name-margin">@ Channel Name</p>
            </div>
          </div>
          <div className="row">
            <div className="col input-position">
              <input
                type="text"
                className="rounded-3 input-field-chat yellow-box-chat"
                placeholder="Send a message..."></input>
            </div>
          </div>
        </div>
        <div className="col-2 rounded-4 blue-box-chat">
          <div className="row">
            <div className="col">
              <p className="blue-titles center-position titles-position">MEMBERS</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
