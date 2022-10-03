import React from "react";
import ChatModal from "../../../Components/Modal/ChatModals";
import PongAdvancedModal from "../../../Components/Modal/PongAdvancedModal";
import BrowseChannels from "./BrowseChannels";
import CreateChannel from "./CreateChannel";
import FriendList from "./FriendList";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import BrowseModal from "../../../Components/Modal/browseModal";

export default function ModalChat({
  user,
  friends,
  allChannels,
  socket,
  switchChannel,
  updateOwnChannels,
  showBrowseChannel,
  handleCloseBrowseChannel,
  showCreateChannel,
  handleCloseCreateChannel,
  showFriendList,
  handleCloseFriendList,
  setCreateDirectid,
  createDirect,
  createNonDirectChannel,
  ...props
}: any) {
  return (
    <>
    {/* BROWSE CHANNEL */}
      <PongAdvancedModal
        title="Browse channels"
        show={showBrowseChannel}
        closeHandler={handleCloseBrowseChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseBrowseChannel}
        textBtn2="Validate"
        handleBtn2={handleCloseBrowseChannel}
      >
        <BrowseChannels
          allChannels={allChannels}
          userChannel={user?.channels}
          userId={user?.id}
          socket={socket}
          updateOwnChannels={updateOwnChannels}
          switchChannel={switchChannel}
          handleCloseBrowseChannel={handleCloseBrowseChannel}
        />
      </PongAdvancedModal>
    {/* CREATE CHANNEL */}
      <ChatModal
        title="Create a channel"
        show={showCreateChannel}
        closeHandler={handleCloseCreateChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseCreateChannel}
        textBtn2="Create"
        handleBtn2={createNonDirectChannel}
      >
        <CreateChannel
          userId={user.id}
          friends={friends}
          createNonDirectChannel={createNonDirectChannel}
        />
      </ChatModal>
      {/* SELECT FRIEND */}
      <BrowseModal
        title="Select Friend"
        show={showFriendList}
        closeHandler={handleCloseFriendList}
        textBtn1="Cancel"
        handleBtn1={handleCloseFriendList}
      >
        <FriendList
          userId={user?.id}
          friends={friends}
          createDirect={createDirect}
        />
      </BrowseModal>
    </>
  );
}
