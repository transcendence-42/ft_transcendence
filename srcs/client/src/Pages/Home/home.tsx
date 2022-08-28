import {useState, useEffect} from "react";
import Play from "./Play"
import './home.css';
import "../../Components/Tools/Box.css"


export default function Home () {
    const [user, setUser] = useState(null);
    const [loginOrRegister, setAuthState]= useState(null);

    return (
        <> 
          <Play />
        </>
    );
}

  // useEffect(() => {
  //   const getUser = () => {
  //     fetch("http://127.0.0.1:4200/auth/success", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": "true",
  //       }
  //     })
  //       .then((response) => {
  //         if (response.status === 200 || response.status === 201)
  //           return response.json();
  //         throw new Error("authentification failed.");
  //       })
  //       .then((responseObject) => {
  //         console.log(
  //           "this is response from fetch: ",
  //           JSON.stringify(responseObject, null, 4)
  //         );
  //         setUser(responseObject.user);
  //         setAuthState(responseObject.message);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   getUser();
  // }, []);


            {/* <h2 className="blueText" style={{fontSize: "50px"}}> ABCD </h2>
            <h2 className="yellowText" style={{fontSize: "50px"}} > ABCD </h2>
            <h2 className="pinkText" style={{fontSize: "70px"}}> ABCD </h2> */}

            {/* <div className="yellowBox"
                style={{
                  width: "200px",
                  height: "200px",
                  left: "200px",
                  top: "550px"
                  }}>
                  <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2>
            </div>

            <div className="yellowBox2"
                style={{
                  width: "200px",
                  height: "200px",
                  left: "500px",
                  top: "550px"
              }}>
              <h2 className="pinkText" style={{fontSize: "40px"}}> ABCD </h2>
            </div> */}