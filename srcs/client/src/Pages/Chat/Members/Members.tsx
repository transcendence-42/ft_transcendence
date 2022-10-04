import React from "react";
import { UserOnChannel } from "../entities/user.entity";
import { findChannel, isEmpty } from "../utils";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import UserInMembers from "./UserInMembers";

export default function Members({
  currentChannel,
  allUsers,
  allChannels,
  ...props
}: any) {
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
      <div className="row">
        <div className="col">
          <>
            {!isEmpty(currentChannel) &&
              findChannel(currentChannel.id, allChannels)?.users?.map(
                (members) => (
                  <div key={members.userId}>
                    <UserInMembers
                      user={allUsers[members.userId]?.username}
                      id={allUsers[members.userId]?.id}
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
