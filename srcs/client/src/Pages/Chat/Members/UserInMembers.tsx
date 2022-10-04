import React from "react";
import { UserOnChannel } from "../entities/user.entity";
import { findChannel, isEmpty } from "../utils";
import { Link } from "react-router-dom";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function UserInMembers({ user, id, ...props }: any) {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="textPink" style={{ fontSize: "0.9em" }}>
              {user}
            </td>
            <td>
            <div className="btn-group dropleft">
              <button
                className="rounded-4 dropdown-toggle
                color-dropdown channel-button "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu channel-menu text-center">
                <li className="dropdown-item">Mute</li>
                <li className="dropdown-item">Ban</li>
                <li className="dropdown-item">Block</li>
                <Link to={`/profile/${id}`}>
                  <li className="dropdown-item"> View Profile </li>
                </Link>
                <li className="dropdown-item">Challenge</li>
              </ul>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
