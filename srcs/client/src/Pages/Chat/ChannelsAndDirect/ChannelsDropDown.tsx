import React from "react";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";

export default function ChannelsDropDown({
  handleShowBrowseChannel,
  handleShowCreateChannel,
  ...props
}: any) {
  return (
    <>
      <button
        className="float-end rounded-4 color-dropdown channel-button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        +
      </button>
      <ul className="dropdown-menu channel-menu">
        <li className="dropdown-item" onClick={handleShowBrowseChannel}>
          Browse channels
        </li>
        <li className="dropdown-item" onClick={handleShowCreateChannel}>
          Create a channel
        </li>
      </ul>
    </>
  );
}
