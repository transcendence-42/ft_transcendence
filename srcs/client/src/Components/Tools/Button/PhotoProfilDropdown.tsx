import React from 'react';
import '../Text.css';
import '../Box.css';
import { Link } from 'react-router-dom';

const PhotoProfilDropdown = (props: any) => {
  return (
    <div className="dropdown dropend">
      <button
        className="profilBoxDropdown box-dark"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          width: props.width,
          height: props.height,
        }}
      >
        <img src={props.url} alt="IMG"></img>
      </button>
      <ul
        className="dropdown-menu dropdown-menu-dark box-blue"
        aria-labelledby="dropdownMenuButton1"
      >
        <Link
          to={`/profile/${props.id}`}
          state={{ userId: props.id, originalId: props.originalId }}
          className="btn textBlue"
        >
        View Profile
        </Link>
      </ul>
    </div>
  );
}

export default PhotoProfilDropdown;
