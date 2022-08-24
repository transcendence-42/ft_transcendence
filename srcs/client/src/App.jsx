import Navbar from "./components/Navbar";
import Home from "./Home";
import Login from "./Login";
import "./App.css";
import Play from "./components/Play";
import "./Box.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch("http://127.0.0.1:4200/auth/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201)
            return response.json();
          throw new Error("authentification failed.");
        })
        .then((responeObject) => setUser(responeObject.user))
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);
  console.log(`Logging user inside App.jsx ${JSON.stringify(user, null, 4)}`);
  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} />
          <h2 className="blueText" style={{fontSize: "50px"}}> ABCD </h2>
          <h2 className="yellowText" style={{fontSize: "50px"}} > ABCD </h2>
          <h2 className="pinkText" style={{fontSize: "70px"}}> ABCD </h2>
          < Play />

        <div className="yellowBox"
          style={{
            width: "200px",
            height: "200px",
            left: "200px",
            top: "550px"
            }}> <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2> </div>

          <div className="yellowBox2"
          style={{
            width: "200px",
            height: "200px",
            left: "500px",
            top: "550px"
            }}> <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2> </div>
            
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
};

export default App;
