
import "../styles/SpaceBox.css";

import { isExpired } from "react-jwt";

function SpaceBox(props) {

    const token = localStorage.getItem('token');
    const loggedIn = !isExpired(localStorage.getItem('token'));

    async function updateSpace() {
      const nameBox = document.getElementById(props.data._id+"nameBox");
      if(!nameBox.value){
          nameBox.placeholder = "Feld required";
          return;
      }

      const data = {}
      data.name = nameBox.value;

      nameBox.value = "";
      nameBox.placeholder = "Updating...";

      data.spaceID = props.data._id;
      try{
        const res = await fetch("http://localhost:3001/api/space/name", {
          method: "PUT",
          headers: {'authorization': token, 'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        if(res.status === 401){
          localStorage.removeItem('token');
          window.location.replace("/");
        }
        else if(res.status === 400 ||res.status === 409 ){
          nameBox.value = props.data.name;
        }
        else{
          const result = await res.json();
          props.updateMe(result)
          nameBox.value = result.name;
          nameBox.placeholder = "";
        }
      }
      catch(error){
        console.log(error);
      }
    }

      async function deleteSpace() {
        const button = document.getElementById(props.data._id+"deleteButton");
        if(button.innerText === "Delete"){
          button.innerText="Confirm";
          button.style.color="red";
          return;
        }

          const nameBox = document.getElementById(props.data._id+"nameBox");
          nameBox.value="Removing"
          nameBox.style.color = "red";

        try{
          const data={}
          data.spaceID = props.data._id;
          const res = await fetch("http://localhost:3001/api/space", {
            method: "DELETE",
            headers: {'authorization': token, 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          })
          if(res.status === 401){
            localStorage.removeItem('token');
            window.location.replace("/");
          }
          else if(res.status === 400 || res.status === 400){
            nameBox.value = props.data.name;
          }
          else if(res.status === 200 ){
            props.deleteMe(props.data._id);
          }




        }
        catch(error){
          console.log(error);
        }
      }


  return (
    <div className="spaceDiv">

      {loggedIn?
      (
        <>
        <input id={props.data._id+"nameBox"}defaultValue={props.data.name} />
        <button onClick={()=>updateSpace()}>Update</button>
        <button id={props.data._id+"deleteButton"} onClick={()=>deleteSpace()}>Delete</button>
        </>
      )

      :
      (
              <p>{props.data.name}</p>
      )
    }

              <p style={{color: props.data.taken?"red":"green"}}>{props.data.taken?"Taken":"Free"}</p>




    </div>
  )

}

export default SpaceBox;
