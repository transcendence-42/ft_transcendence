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
  userId,
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
          <>
            {!isEmpty(currentChannel) &&
              findChannel(currentChannel.id, allChannels)?.users?.map(
                (member) =>
                  member.userId === userId ? (
                    ""
                  ) : (
                    <div key={member.userId}>
                      <UserInMembers user={allUsers[member.userId]?.username} />
                    </div>
                  )
              )}
          </>
        </div>
      </div>
      <div className="row">
        <div className="col overflow-auto"></div>
      </div>
    </div>
  );
}
