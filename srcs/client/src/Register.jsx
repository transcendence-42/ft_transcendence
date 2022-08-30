const Register = () => {
  const localRegister = () => {};

  const fortyTwoRegister = () => {
    window.open("http://127.0.0.1:4200/auth/42/register", "_self");
  };
  return (
    <div className="register">
      <h1 className="registerTitle">Register</h1>
      <div className="wrapper">
        <div className="registerButton fortyTwo" onClick={fortyTwoRegister}>
          Register 42
        </div>
      </div>
      <div className="center">
        <div className="line" />
        <div className="or">OR</div>
      </div>
      <input type="text" placeholder="username" />
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button className="submit">Register</button>
    </div>
  );
};

export default Register;
