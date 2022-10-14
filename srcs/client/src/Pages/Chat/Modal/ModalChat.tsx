import React from "react";
import ChatModal from "../../../Components/Modal/ChatModals";
import PongAdvancedModal from "../../../Components/Modal/PongAdvancedModal";
import BrowseChannels from "./BrowseChannels";
import CreateChannel from "./CreateChannel";
import FriendList from "./FriendList";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import BrowseModal from "../../../Components/Modal/browseModal";
import AddFriendToChannel from "./AddFriendToChannel";
import SetPasswordChannel from "./SetPasswordChannel";

export default function ModalChat({
  user,
  friends,
  allChannels,
  socket,
  switchChannel,
  updateOwnUserOnChannel,
  showBrowseChannel,
  handleCloseBrowseChannel,
  showCreateChannel,
  handleCloseCreateChannel,
  showFriendList,
  handleCloseFriendList,
  setCreateDirectid,
  createDirect,
  addToChannel,
  handleCloseAddToChannel,
  handleShowAddToChannel,
  showAddToChannel,
  createNonDirectChannel,
  currentChannel,
  changeChannelPassword,
  showPassworChannel,
  handleClosePassworChannel,
  handlePasswordOperation,
  newChannelPassword,
  setNewChannelPassword,
  ...props
}: any) {
  return (
    <>
      {/* BROWSE CHANNEL */}
      <ChatModal
        title="Browse channels"
        show={showBrowseChannel}
        closeHandler={handleCloseBrowseChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseBrowseChannel}
        textBtn2="Join"
        handleBtn2={handleCloseBrowseChannel}
        formId={"joinChannelForm"}
      >
        <BrowseChannels
          allChannels={allChannels}
          userChannels={user.channels}
          userId={user.id}
          socket={socket}
          updateOwnUserOnChannel={updateOwnUserOnChannel}
          switchChannel={switchChannel}
          handleCloseBrowseChannel={handleCloseBrowseChannel}
        />
      </ChatModal>
      {/* CREATE CHANNEL */}
      <ChatModal
        title="Create a channel"
        show={showCreateChannel}
        closeHandler={handleCloseCreateChannel}
        textBtn1="Cancel"
        handleBtn1={handleCloseCreateChannel}
        textBtn2="Create"
        handleBtn2={createNonDirectChannel}
        formId={"createChannelForm"}
      >
        <CreateChannel
          userId={user.id}
          friends={friends}
          createNonDirectChannel={createNonDirectChannel}
        />
      </ChatModal>
      {/* SELECT FRIEND */}
      <BrowseModal
        title="Select Friend" // create a direct channel
        show={showFriendList}
        closeHandler={handleCloseFriendList}
        textBtn1="Cancel"
        handleBtn1={handleCloseFriendList}
      >
        <FriendList
          userId={user?.id}
          friends={friends}
          createDirect={createDirect}
          userChannels={user?.channels}
        />
      </BrowseModal>
      {/* ADD FRIEND */}
      {currentChannel && (
        <BrowseModal
          title="Add a Friend" //add someone to a channel
          show={showAddToChannel}
          closeHandler={handleCloseAddToChannel}
          textBtn1="Cancel"
          handleBtn1={handleCloseAddToChannel}
        >
          <AddFriendToChannel
            userId={user?.id}
            friends={friends}
            addToChannel={addToChannel}
            allChannels={allChannels}
            channel={currentChannel}
          />
        </BrowseModal>
      )}
      {/* SET PASSWORD */}
      <PongAdvancedModal
        title="Set a Password for this Channel" //add someone to a channel
        show={showPassworChannel}
        closeHandler={handleCloseAddToChannel}
        textBtn1="Cancel"
        handleBtn1={handleClosePassworChannel}
        textBtn2="Validate"
        handleBtn2={handlePasswordOperation}
      >
        <SetPasswordChannel
          setNewChannelPassword={setNewChannelPassword}
        />
      </PongAdvancedModal>
    </>
  );
}
