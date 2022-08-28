import { useState } from "react";

const Logout = () => {
  const [logoutMessage, setLogoutMessage] = useState(null);
  const logoutUser = () => {
    fetch("http://127.0.0.1:4200/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then((resp) => {
        console.log(`response from logout in /logout ${resp}`);
        return resp.json();
      })
      .then((response) => setLogoutMessage(response))
      .catch((err) => console.log(`Error from /logout ${err}`));
  };
  logoutUser();
  return <div>{logoutMessage}</div>;
};

export default Logout;
