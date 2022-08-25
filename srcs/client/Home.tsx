import React from "react";

const Home = ({ user }) => {
    return (
      <div className="Home">
        {user ? (
          <h1>
            {user.authMessage} for user {user.username}!
          </h1>
        ) : (
          <h1>Welcome Home !</h1>
        )}
      </div>
    );
  };
  
  export default Home;