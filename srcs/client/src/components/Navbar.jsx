import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <div className="navbar">
      <Link className="link" to="home">
        Transcendence
      </Link>
      {/* <span className="logo">Transcendence</span> */}
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img className="avatar" src={user.profile_picture} />
          </li>
          <li className="listItem">{user.username}</li>
          <Link className="link" to="logout">
            Logout
          </Link>
        </ul>
      ) : (
        <Link className="link" to="login">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
