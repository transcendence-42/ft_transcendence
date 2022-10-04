import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import { eUserRole } from "../constants";

export default function UserInMembers({
  memberName,
  self,
  member,
  currentChannel,
  muteUser,
  banUser,
  blockUser,
  ...props
}: any) {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="textPink" style={{ fontSize: "0.9em" }}>
              {memberName}
            </td>
            <td>
              <button
                className="rounded-4 dropdown-toggle color-dropdown channel-button "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu channel-menu text-center">
                {member.role === eUserRole.OWNER ||
                (self.role === eUserRole.ADMIN &&
                  member.role === eUserRole.ADMIN) ||
                self.role === eUserRole.USER ? (
                  ""
                ) : (
                  <>
                    {member.isMuted ? (
                      ""
                    ) : (
                      <li
                        onClick={(e) =>
                          muteUser(member.userId, member.channelId)
                        }
                        className="dropdown-item"
                      >
                        Mute
                      </li>
                    )}
                    <li
                      onClick={(e) => banUser(member.userId, member.channelId)}
                      className="dropdown-item"
                    >
                      Ban
                    </li>
                  </>
                )}
                <li
                  onClick={(e) => blockUser(member.id)}
                  className="dropdown-item"
                >
                  Block
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
