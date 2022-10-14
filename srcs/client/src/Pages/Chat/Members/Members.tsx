import React from "react";
import { UserOnChannel } from "../entities/user.entity";
import { getChannel, isEmpty } from "../utils";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import UserInMembers from "./UserInMembers";
import { eChannelType } from "../constants";

export default function Members({
  currentChannel,
  allUsers,
  allChannels,
  user,
  blockUser,
  muteUser,
  banUser,
  blockedUsers,
  handleShowAddToChannel,
  changeRole,
  ...props
}: any) {
  const self = user.channels.find(
    (userOnChan) => userOnChan.channelId === currentChannel.id
  );

  return (
    <div className="  rounded-4 blue-box-chat col-3 chat-sidebar-right h-100">
      <div className="row mt-2">
        <div className="col">
          <p
            className="blue-titles center-position"
            style={{ fontSize: "12px" }}
          >
            MEMBERS
          </p>
        </div>
      </div>
      <div className="row" style={{ fontSize: "14px" }}>
        <div className="col d-flex justify-content-center">
          {!isEmpty(currentChannel) &&
          currentChannel.type !== eChannelType.DIRECT ? (
            <button
              className="message-button rounded-4 "
              onClick={handleShowAddToChannel}
            >
              Add Friend
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <>
            {!isEmpty(currentChannel) &&
              getChannel(currentChannel.id, allChannels)?.users?.map(
                (member: UserOnChannel) =>
                  member.userId === user.id || member.hasLeftChannel ? (
                    ""
                  ) : (
                    <div key={member.userId}>
                      <UserInMembers
                        memberName={allUsers[member.userId]?.username}
                        self={self}
                        member={member}
                        muteUser={muteUser}
                        banUser={banUser}
                        blockUser={blockUser}
                        currentChannel={currentChannel}
                        blockedUsers={blockedUsers}
                        changeRole={changeRole}
                        currentUserId={user.id}
                      />
                    </div>
                  )
              )}
          </>
        </div>
      </div>
    </div>
  );
}
