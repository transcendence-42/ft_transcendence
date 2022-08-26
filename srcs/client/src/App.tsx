import React, { useState } from 'react';
import './Components/Tools/App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home/home'
import Profile from './Components/Profile/Profile'
import Notfound from './Components/NotFound/notFound';
import NavBar from './Components/Tools/NavBar/NavBar';
import { hasAuthenticated } from './Components/services/authApi';
import AuthenticatedRoute from './Components/services/authenticatedRoute';
import setIsAuthenticated from './Components/services/authenticatedRoute';


function App() {
  
  const[isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated);

  return (

        <div className="main">
          <NavBar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route  path='/' element={<AuthenticatedRoute setIsAuthenticated/>}>
              < Route path="/profile/:id" element={<Profile />} />
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