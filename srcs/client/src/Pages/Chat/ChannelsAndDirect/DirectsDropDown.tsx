import React from "react";
import { Link } from "react-router-dom";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function DirectsDropDown({ user, id, ...props }: any) {
  return (
    <>
      <table>
        <tbody>
          <tr className="">
            <td className="textPink" style={{ fontSize: "0.9em" }}>
              {user}
            </td>
            <td>
              <button
                className="rounded-4 dropdown-toggle color-dropdown channel-button "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu channel-menu text-center">
                <Link to={`/profile/${id}`}>
                  <li className="dropdown-item"> View Profile </li>
                </Link>
                <li className="dropdown-item"> Challenge </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
