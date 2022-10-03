import React from "react";
import { UserOnChannel } from "../entities/user.entity";
import { findChannel, isEmpty } from "../utils";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function UserInMembers({
  user,
  currentChannel,
  allUsers,
  allChannels,
  ...props
}: any) {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="textPink" style={{fontSize:"0.9em"}}  >{user}</td>
            <td>
              <button
                className="rounded-4 dropdown-toggle color-dropdown channel-button "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu channel-menu text-center">
                <li className="dropdown-item">Mute</li>
                <li className="dropdown-item">Ban</li>
                <li className="dropdown-item">Block</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
