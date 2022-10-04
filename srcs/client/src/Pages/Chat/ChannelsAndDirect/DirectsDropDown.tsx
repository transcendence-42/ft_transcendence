import React from "react";
import { Link } from "react-router-dom";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function DirectsDropDown({id, ...props }: any) {
  return (
    <>
            <td>
              <button
                className="rounded-4 dropdown-toggle color-dropdown channel-button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu channel-menu">
                <Link to={`/profile/${id}`}>
                  <li className="dropdown-item"> View Profile </li>
                </Link>
                <li className="dropdown-item"> Challenge </li>
              </ul>
            </td>
    </>
  );
}
