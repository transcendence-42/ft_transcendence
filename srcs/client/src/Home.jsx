const Home = ({ user, loginOrRegister }) => {
  return (
    <div className="Home">
      {user ? (
        <h1>
          {loginOrRegister} for user {user.username}!
        </h1>
      ) : (
        <h1>Welcome Home !</h1>
      )}
    </div>
  );
};

export default Home;
