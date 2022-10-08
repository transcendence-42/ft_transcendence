import React from "react";
import { Channel, User, UserOnChannel } from "../entities/user.entity";
import { useState } from "react";
import { eChannelType } from "../constants";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";

export default function SetPasswordChannel({
  setNewChannelPassword,
  ...props
}: any) {
  return (
    <>
      <input
        className="rounded-3 input-field-chat w-75 "
        onChange={(e) => setNewChannelPassword(e.target.value)}
        maxLength={15}
        placeholder="Channel Password"
      ></input>
    </>
  );
}
