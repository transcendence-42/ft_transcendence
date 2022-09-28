import "./CreateChannel.css";
import { useState } from "react";
import { eChannelType, eEvent } from "./constants";
import { fetchUrl } from "./utils";

export default function CreateChannel({
  userId,
  socket,
  handleCreateChannel,
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
          handleCreateChannel(
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
        ></input>
        <div className="form-check">
          <input
            className="form-check-input radio-custom"
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
            aria-expanded="false"
            aria-controls="collapseProtected"
            // onClick={setChannelType(eChannelType.PRIVATE)}
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
// <form
//   id="createChannelForm"
//   className="form-label"
//   onSubmit={(e) =>
//     handleCreateChannel(
//       e,
//       channelName,
//       channelType,
//       userId,
//       channelPassword
//     )
//   }
// >
//   <label className="form-label">Name</label>
//   <input
//     type="name"
//     className="form-control form-control-margin"
//     placeholder="# channel-name"
//     onChange={(e) => setChannelName(e.target.value)}
//     value={channelName}
//   ></input>
//   <ul className="list-group">
//     <select
//       onChange={(e) => setChannelType(e.target.value as eChannelType)}
//     >
//       <option value={eChannelType.PUBLIC}>Public</option>
//       <option value={eChannelType.PRIVATE}>Private</option>
//       <option value={eChannelType.PROTECTED}>Protected</option>
//     </select>
//     <input
//       onChange={(e) => setChannelPassword(e.target.value)}
//       value={channelPassword}
//       type="name"
//       className="form-control form-control-margin"
//       placeholder="Password"
//     ></input>
//   </ul>
// </form>
// );
