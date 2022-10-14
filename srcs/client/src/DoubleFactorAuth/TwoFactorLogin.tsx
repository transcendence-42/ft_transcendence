import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TwoFactorLogin = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const apiUrl: string = process.env.REACT_APP_API_URL as string;
  const postTwoFactorCode = async (e: any) => {
    e.preventDefault();
    fetch(`${apiUrl}/auth/2fa/authenticate/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: code
      })
    })
    .then((resp) => resp.json())
    .then((response) => {
      // console.log(
      //   `This is response from 2fa ${JSON.stringify(response, null, 4)}`);
      if (response.statusCode !== 401)
        navigate("/");
      return response;
    });
  };
  return (
    <div>
      Hello world from TwoFactor
      <div>
        <h1> Submit Code </h1>
        <form onSubmit={postTwoFactorCode}>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button> submit </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorLogin;
