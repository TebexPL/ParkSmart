import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { isExpired } from "react-jwt";

import io from "socket.io-client";
import Navbar from "./Navbar.js";
import Statistics from "./Pages/Statistics.js";
import History from "./Pages/History.js";
import Sections from "./Pages/Sections.js";
import Login from "./Pages/Login.js";

function App() {
  const loggedIn = !isExpired(localStorage.getItem('token'));
  const token = localStorage.getItem('token');
  const socket = loggedIn?io("http://localhost:3001", {
    auth: {
      token:token
    }
  }):io("http://localhost:3001");
  return (
        <Router>
          <Navbar />
          <Routes>
            {
              loggedIn?(
                <>
                  <Route path="/Statistics" element={
                      <Statistics socket={socket} />}
                  />
                  <Route path="/History" element={
                      <History socket={socket}/>}
                  />
                </>
              )
              :
              (
                <Route path="/Login" element={
                    <Login />}
                />
              )
            }

            <Route path="*" element={<Sections socket={socket} />} />
          </Routes>
        </Router>
  );
}

export default App;
