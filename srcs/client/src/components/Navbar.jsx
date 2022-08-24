import { Link } from "react-router-dom";

const Navbar = ({user}) => {
  return (
    <div className="navbar">
      <span className="logo">Transcendence</span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
            //   src="https://cdn.intra.42.fr/users/nammari.jpg"
            src={user.profile_picture}
              alt=""
              className="avatar"
            ></img>
          </li>
          <li className="listItem">Noufel Ammari</li>
          <li className="listItem">Logout</li>
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
