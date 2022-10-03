import React from "react";
import { UserOnChannel } from "../entities/user.entity";
import { findChannel, isEmpty } from "../utils";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

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
          <>
            {!isEmpty(currentChannel) &&
              findChannel(currentChannel.id, allChannels)?.users?.map(
                (members) => (
                  <div key={members.userId}>
                    {allUsers && allUsers[members.userId]?.username}
                  </div>
                )
              )}
          </>
        </div>
      </div>
      <div className="row">
        <div className="col overflow-auto">
          <table>
            <tbody>
              <tr>
                <td>User</td>
                <td>
                  <button
                    className="rounded-4 dropdown-toggle color-dropdown channel-button "
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul className="dropdown-menu channel-menu text-center">
                    <li className="dropdown-item">Mute</li>
                    <li className="dropdown-item">Ban</li>
                    <li className="dropdown-item">Kick</li>
                    <li className="dropdown-item">Block</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
