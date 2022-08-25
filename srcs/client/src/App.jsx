import Navbar from "./components/Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [loginOrRegister, setAuthState]= useState(null);
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
        .then((responseObject) => {
          console.log(
            "this is response from fetch: ",
            JSON.stringify(responseObject, null, 4)
          );
          setUser(responseObject.user);
          setAuthState(responseObject.message);
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);
  console.log(`Logging user inside App.jsx ${JSON.stringify(user, null, 4)}`);
  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} />
        <Routes>
          <Route
            path="/"
            element={<Home user={user} loginOrRegister={loginOrRegister} />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
          path="/register"
          element={<Register user={user} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
