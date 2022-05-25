import "../styles/Section.css";

import { isExpired } from "react-jwt";

function Section(props) {

    const loggedIn = !isExpired(localStorage.getItem('token'));

  return (
    <>
    <div className="trigDivHeader">


        <p>Section Name</p>
        <p>Cost ($/Hr)</p>
        {loggedIn?<p></p>:<></>}
        <p>Free spaces / All spaces</p>

        <p></p>
    </div>

    </>
  )

}

export default Section;
