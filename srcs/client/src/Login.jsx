import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const fortyTwoLogin = () => {
    window.open("http://127.0.0.1:4200/auth/42/register", "_self");
  };

  const localLogin = async (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:4200/auth/local/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((response) => response.json())
      .then((resp) => {
        console.log(JSON.stringify(resp, null, 4));
        // if (resp.statusCode !== 401) navigate("/");
        return resp;
      })
      .catch((err) => console.log(`Error from LocalLogin ${err}`));
      // navigate("/");
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Choose your Login Method:</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton fortyTwo" onClick={fortyTwoLogin}>
            Login 42
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <form onSubmit={localLogin}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username"
            />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
