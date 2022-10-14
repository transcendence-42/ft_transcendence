import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserOnChannel } from "../entities/user.entity";
// import { findChannel, isEmpty } from "../utils";
import { Link } from "react-router-dom";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import { eChannelType, eUserRole } from "../constants";
import { GameSocketContext } from "../../Game/socket/socket";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function UserInMembers({
  memberName,
  self,
  member,
  currentChannel,
  muteUser,
  banUser,
  blockUser,
  blockedUsers,
  changeRole,
  currentUserId,
  ...props
}: any) {
  /** *********************************************************************** */
  /** GLOBAL                                                                   */
  /** *********************************************************************** */

  const socket = useContext(GameSocketContext);

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum ePlayerStatus {
    OFFLINE = 0,
    ONLINE,
    WAITING,
    PLAYING,
    SPECTATING,
    CHALLENGE
  }

  enum eAction {
    NOTHING = 0,
    JOIN,
    SPECTATE
  }

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */

  const [players, setPlayers] = useState([] as any);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handlePlayersInfo = useCallback((data: any) => {
    setPlayers(data.players);
  }, []);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const getPlayerFromId = (id: number) => {
    if (players !== undefined) {
      let result = players.find((p: any) => p.id === id.toString());
      if (result === undefined) result = { status: 0 };
      return result;
    }
    return { status: 0 };
  };

  const handleChallengePlayer = (id: string) => {
    socket.emit("challengePlayer", { id: id });
  };

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    socket.emit("getPlayersInfos");
    socket.on("playersInfos", handlePlayersInfo);
    return () => {
      socket.off("playersInfos", handlePlayersInfo);
    };
  }, [handlePlayersInfo, socket]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="textPink" style={{ fontSize: "0.9em" }}>
              {memberName}
            </td>
            <td>
              <div className="btn-group dropleft">
                <button
                  className="rounded-4 dropdown-toggle
                color-dropdown channel-button "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu channel-menu text-start">
                  {member.role === eUserRole.OWNER ||
                  (self.role === eUserRole.ADMIN &&
                    member.role === eUserRole.ADMIN) ||
                  self.role === eUserRole.USER ||
                  currentChannel.type === eChannelType.DIRECT ? (
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
                        onClick={(e) =>
                          banUser(member.userId, member.channelId)
                        }
                        className="dropdown-item"
                      >
                        Ban
                      </li>
                    </>
                  )}
                  <>
                    {(self && self.role !== eUserRole.OWNER) ||
                    currentChannel.type === eChannelType.DIRECT ? (
                      ""
                    ) : (
                      <>
                        {member.role === eUserRole.ADMIN ? (
                          <li
                            onClick={(e) =>
                              changeRole(
                                member.userId,
                                member.channelId,
                                eUserRole.USER
                              )
                            }
                            className="dropdown-item"
                          >
                            Give User role
                          </li>
                        ) : (
                          <li
                            onClick={(e) =>
                              changeRole(
                                member.userId,
                                member.channelId,
                                eUserRole.ADMIN
                              )
                            }
                            className="dropdown-item"
                          >
                            Give Admin role
                          </li>
                        )}
                      </>
                    )}
                    {blockedUsers[member.userId] ? (
                      ""
                    ) : (
                      <li
                        onClick={(e) => blockUser(member.userId)}
                        className="dropdown-item"
                      >
                        Block
                      </li>
                    )}
                    <Link to={`/profile/${member.userId}`}>
                      <li className="dropdown-item"> View Profile </li>
                    </Link>

                    {/* Game interaction */}
                    {players &&
                      getPlayerFromId(member.userId).status ===
                        ePlayerStatus.ONLINE &&
                      getPlayerFromId(currentUserId).status ===
                        ePlayerStatus.ONLINE && (
                        <li
                          className="dropdown-item"
                          onClick={() =>
                            handleChallengePlayer(member.userId.toString())
                          }
                        >
                          <SportsEsportsIcon /> Challenge
                        </li>
                      )}
                    {players &&
                      getPlayerFromId(member.userId).status ===
                        ePlayerStatus.PLAYING &&
                      getPlayerFromId(currentUserId).status ===
                        ePlayerStatus.ONLINE && (
                        <Link
                          to="/lobby"
                          state={{
                            origin: {
                              name: "chat",
                              loc: `/chat`,
                              state: null
                            },
                            gameId: getPlayerFromId(member.userId).game,
                            action: eAction.SPECTATE
                          }}
                        >
                          <li className="dropdown-item">
                            <VisibilityIcon /> Spectate
                          </li>
                        </Link>
                      )}
                  </>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
