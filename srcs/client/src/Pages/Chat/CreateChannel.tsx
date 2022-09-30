import "./CreateChannel.css";
import { useState } from "react";
import { eChannelType } from "./constants";

export default function CreateChannel({
  userId,
  socket,
  createNonDirectChannel,
  ...props
}: any) {
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");
  const [channelType, setChannelType] = useState(eChannelType.PUBLIC);

  return (
    <div>
      <form
        id="createChannelForm"
        className="form-label"
        onSubmit={(e) =>
          createNonDirectChannel(
            e,
            channelName,
            channelType,
            userId,
            channelPassword
          )
        }
      >
        <label className="form-label">Name</label>
        <input
          type="name"
          className="form-control form-control-margin"
          placeholder="# channel-name"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          maxLength={11}
         
        ></input>
        <div className="form-check">
          <input
            className="form-check-input radio-custom"
            defaultChecked
            type="radio"
            name="channelRadios"
            id="channelRadio1"
            value="option1"
            onClick={() => {
              setChannelType(eChannelType.PUBLIC);
              const bsCollapse = document.getElementById("collapseProtected");
              bsCollapse?.classList.remove("show");
            }}
          ></input>
          <label className="form-check-label" htmlFor="channelRadios1">
            Public
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input radio-custom"
            type="radio"
            name="channelRadios"
            id="channelRadio2"
            value="option2"
            onClick={() => {
              setChannelType(eChannelType.PRIVATE);
              const bsCollapse = document.getElementById("collapseProtected");
              bsCollapse?.classList.remove("show");
            }}
          ></input>
          <label className="form-check-label" htmlFor="channelRadios2">
            Private
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input radio-custom"
            type="radio"
            name="channelRadios"
            id="channelRadio3"
            value="option3"
            data-bs-toggle="collapse"
            data-bs-target="#collapseProtected"
            aria-controls="collapseProtected"
            onClick={(e) => setChannelType(eChannelType.PROTECTED)}
          ></input>
          <label className="form-check-label" htmlFor="channelRadios3">
            Protected
          </label>
          <div className="collapse collapse-margin" id="collapseProtected">
            <input
              type="name"
              className="form-control form-control-margin"
              placeholder="Password"
              onChange={(e) => setChannelPassword(e.target.value)}
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}
