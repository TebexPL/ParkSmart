
import {Link} from "react-router-dom";
import {isExpired} from "react-jwt";

import './Pages/styles/Navbar.css'
function Navbar() {

    const token = localStorage.getItem('token');
    const isLoggedIn = !isExpired(localStorage.getItem('token'));


    const logout = async  () => {
      try{
        const data = {}
        data.token=token;
        await fetch("https://park--smart.herokuapp.com/api/user", {
          method: "DELETE",
          headers: {'authorization': token},
        })

      }
      catch(error){
        console.log(error);
      }
      finally{
        localStorage.removeItem('token');
        window.location.replace('/');
      }
    }


  return (

    <>
      <div className='container'>
        <div className='title'>
          <h2>ParkSmart</h2>
        </div>
        <div className='links'>
        <Link to="/">Dashboard</Link>
        {
          isLoggedIn?(
            <>
            <Link to="/Statistics">Statistics</Link>
            <Link to="/History">History</Link>
            <a href="/#" onClick={() => logout()} >Log out</a>
            </>
          ):(
            <>
            <Link to="/Login">Log in</Link>
            </>
          )
        }
        </div>
      </div>
      <div style={{height: '10vh'}}></div>
    </>

  )

}

export default Navbar;
