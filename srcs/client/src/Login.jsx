const Login = () => {
  const fortyTwoLogin = () => {
    window.open("http://127.0.0.1:4200/auth/42/register", "_self");
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
          <input type="text" placeholder="username" />
          <input type="text" placeholder="password" />
          <button className="submit">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
