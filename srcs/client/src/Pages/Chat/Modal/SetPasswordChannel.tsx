import React from "react";
import { Channel, User, UserOnChannel } from "../entities/user.entity";
import { useState } from "react";
import { eChannelType } from "../constants";
import "../../../Components/Tools/Text.css";
import "../../../Components/Tools/Box.css";
import "./FriendList.css";


export default function SetPasswordChannel({
  friends,
  channel,
  addToChannel,
  allChannels,
  currentChannel,
  changeChannelPassword,
  setChannelPassword,
  setNewChannelPassword,
  ...props
}: any)
{
  return (
      <>
      <input
        onChange={(e) => setNewChannelPassword(e.target.value)}
        placeholder="Channel Password"
      ></input>
      </>
  );
}
