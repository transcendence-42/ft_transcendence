import { useState } from "react";

const Logout = () => {
  const [logoutMessage, setLogoutMessage] = useState(null);
  const logoutUser = () => {
    fetch("http://127.0.0.1:4200/auth/logout", {
      credentials: "include"
    })
      .then((resp) => setLogoutMessage(resp))
      .catch((err) => console.log(err));
  };
  logoutUser();
  return <div>{logoutMessage}</div>;
};

export default Logout;
