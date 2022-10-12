import React, { useContext } from 'react';
import './NavBar.css';
import '../Text.css';
import '../Box.css';
import { Link } from 'react-router-dom';
import Context from '../../../Context/Context';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar } from 'react-bootstrap';
import { GameSocketContext } from '../../../Pages/Game/socket/socket';

export default function NavBar(props: any) {
  const contextValue = useContext(Context);
  const gameSocket = useContext(GameSocketContext);
  /*
   ** Fetching data for logout
   */
  const apiUrl: string = process.env.REACT_APP_API_URL as string;
  const deco = () => {
    fetch(`${apiUrl}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseObject) => {
        if (responseObject.message) {
          console.log('Disconnect from our services');
          localStorage.removeItem('pathIsFree');
          contextValue.updateIsConnected(false);
          gameSocket.close();
          document.cookie = '';
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  /*
   ** Here this function allows us to fetch our first data and start the
   ** connection flow only if we are from auth42 page
   */

  if (contextValue.isConnected) {
    return (
      <Navbar
        className="navbar bg-dark pt-5 px-5 "
        bg="transparent"
        variant="transparent"
        expand="lg"
        collapseOnSelect
        data-testid="LeaderboardLink"
      >
        <Link to="/" className="aNav">
          <span className="span1"></span>
          <span className="span1"></span>
          <span className="span1"></span>
          <span className="span1"></span>
          <h2 className="blueText px-2 mt-2 " data-testid="HomeLink">
            {' '}
            PONG
          </h2>
        </Link>
        <Navbar.Toggle className="" />
        <Navbar.Collapse className="">
          <Nav className="navbar-nav ms-auto ">
            <Link
              to="/leaderboard"
              state={{ userID: props.userID }}
              className="aNav"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2 className="yellowText mt-2 px-2 ">Leaderboard</h2>
            </Link>
            <Link to="/chat" className="aNav">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2 className="yellowText mt-2 px-2"> Chat </h2>
            </Link>
            <Link
              to={`/profile/${props.userID}`}
              className="aNav"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2 className="yellowText mt-2 px-2"> Profile </h2>
            </Link>
            <Link to="/" onClick={deco} className="aNav">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2
                className="yellowText mt-2 px-2"
                style={{ animation: 'flicker 2.5s infinite alternate' }}
              >
                logout{' '}
              </h2>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  } else {
    return (
      <Navbar
        className="navbar bg-dark pt-5 pb-4 px-5 "
        bg="transparent"
        variant="transparent"
        expand="md"
        collapseOnSelect
      >
        <Link to="/" className="aNav">
          <span className="span1"></span>
          <span className="span1"></span>
          <span className="span1"></span>
          <span className="span1"></span>
          <h2 className="blueText px-2 mt-2 " data-testid="HomeLink">
            {' '}
            PONG
          </h2>
        </Link>
        <Navbar.Toggle className="" />
        <Navbar.Collapse className="">
          <Nav className="navbar-nav ms-auto ">
            <Link to="/leaderboard" className="aNav">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2
                className="yellowText mt-2 px-2"
                data-testid="LeaderboardLink"
              >
                Leaderboard
              </h2>
            </Link>
            <Link to="/login" className="aNav">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h2 className="yellowText mt-2 px-2"> Login </h2>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
