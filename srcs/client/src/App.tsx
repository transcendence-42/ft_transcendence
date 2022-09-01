import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Pages/Home/home'
import Profile from './Pages/Profile/Profile'
import Notfound from './Pages/NotFound/notFound';
import Login from './Pages/Login/Login';
import About from './Pages/About/about';
import Leaderboard from './Pages/Leaderboard/leaderboard';
import Chat from './Pages/Chat/chat';
import NavBar from './components/Tools/NavBar/NavBar';


function App() {
      //  const [user, setUser] = useState(null);
      //  const [isLogged, setIsLogged] = useState(false);

   
      //  const getUser = () => {
      //     fetch("http://127.0.0.1:4200/auth/logout'", {
      //      method: "GET",
      //      credentials: "include",
      //      headers: {
      //        Accept: "application/json",
      //        "Content-Type": "application/json",
      //        "Access-Control-Allow-Credentials": "true",
      //      }
      //    })
      //      .then((response) => {
      //          if (response.status === 200)
      //          {
      //              return response.json();
      //          }
      //         throw console.log("Fail parsing 42auth");
      //      })
      //      .then((responseObject) => {
      //          if (responseObject.message)
      //          {
      //              setUser((responseObject));
      //              console.log(responseObject);
      //              console.log("Success parsing 42auth");
      //              setIsLogged(true);
      //              return;
      //          }
      //      })
      //      .catch((err) => console.log(err));
      //      return(false)
      //  };
      //  useEffect(() => {
      //      getUser();
      //  },[isLogged]);
       
  return (
        <div className="main">
          <NavBar  />
            <Routes>
            <Route path="*" element={<Notfound />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route  path='/'>
              < Route path="/home" element={<Home />} />
              < Route path="/about" element={<About />} />
              < Route path="/chat" element={<Chat />} />
              < Route path="/leaderboard" element={<Leaderboard />} />
              < Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/friends" element={<Profile />} />
            </Route>
          </Routes>
        </div>

  );
}

export default App;


// <div className="main">
// <NavBar />
//   <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="*" element={<Notfound />} />
//   <Route  path='/' element={<AuthenticatedRoute setIsAuthenticated/>}>
//     < Route path="/profile/:id" element={<Profile />} />
//   </Route>
// </Routes>
// </div>

        //  <NavBar />
        //     <Routes>
        //     <Route path="/" element={<Home />} />
        //     <Route path="*" element={<Notfound />} />
        //     <Route  path='/' element={<AuthenticatedRoute/>}>
        //       < Route path="/profile/:id" element={<Profile />} />
        //     </Route>
        //   </Routes>
        // </div>
