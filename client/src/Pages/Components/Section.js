import {useState} from "react";
import "../styles/Section.css";
import SpaceBox from "./SpaceBox.js";
import NewSpaceBox from "./NewSpaceBox.js";

import { isExpired } from "react-jwt";

function Section(props) {
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');
  const loggedIn = !isExpired(localStorage.getItem('token'));

  function click(e) {
    if(props.data.spaces.length<=0 && !loggedIn)
      return;
    if(e.target === e.currentTarget || e.target.tagName==="P")
      setOpen(!open);

  }

  async function updateSection() {
    const nameBox = document.getElementById(props.data._id+"nameBox");
    const costBox = document.getElementById(props.data._id+"costBox");
    if(!nameBox.value){
        nameBox.placeholder = "Feld required";
        return;
    }
    if(!costBox.value){

        costBox.placeholder = "Feld required";
        return;
    }
    if(isNaN(costBox.value) || costBox.value < 0){
      costBox.value = "";
      costBox.placeholder = "Must be a positive integer";
      return;
    }

    const data = {}
    data.name = nameBox.value;
    data.cost = costBox.value;

    costBox.value = "";
    nameBox.value = "";
    costBox.placeholder = "Updating...";
    nameBox.placeholder = "Updating...";

    data.sectionID = props.data._id;
    try{
      const res = await fetch("https://park--smart.herokuapp.com/api/section", {
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
        costBox.value = props.data.cost;
      }
      else{
        const result = await res.json();
        props.updateMe(result)
        nameBox.value = result.name;
        costBox.value = result.cost;
        costBox.placeholder = "";
        nameBox.placeholder = "";
      }



    }
    catch(error){
      console.log(error);
    }
  }

  async function deleteSection() {
    const button = document.getElementById(props.data._id+"deleteButton");
    if(button.innerText === "Delete"){
      button.innerText="Confirm";
      button.style.color="red";
      return;
    }

      const nameBox = document.getElementById(props.data._id+"nameBox");
      const costBox = document.getElementById(props.data._id+"costBox");
      nameBox.value="Removing"
      nameBox.style.color = "red";
      costBox.type = "text";
      costBox.value="Removing"
      costBox.style.color = "red";


    try{

      const data={}
      data.sectionID = props.data._id;
      const res = await fetch("https://park--smart.herokuapp.com/api/section", {
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
        costBox.value = props.data.cost;
      }
      else if(res.status === 200 ){
        props.deleteMe(props.data._id);
      }




    }
    catch(error){
      console.log(error);
    }
  }

  function addSpace(space){
    props.addSpace(props.data._id, space);
  }

  function updateSpace(space){
    props.updateSpace(props.data._id, space);
  }

  function deleteSpace(spaceID){
    props.deleteSpace(props.data._id, spaceID);
  }


  return (
    <>
    <div className="trigDiv" onClick={e => click(e)}>
      {loggedIn?(
        <>
        <input id={props.data._id+"nameBox"} defaultValue={props.data.name}/>
        <input id={props.data._id+"costBox"} type="number"
        defaultValue={props.data.cost}/>
        <div>
        <button onClick={()=>updateSection()}>Update</button>
        <button id={props.data._id+"deleteButton"} onClick={()=>deleteSection()}>Delete</button>
        </div>
        </>
      )
      :
      (
        <>
        <p>{props.data.name}</p>
        <p>{props.data.cost}</p>
        </>
      )}

      <p>{props.data.spaces.filter(obj => {return obj.taken===false}).length}/{props.data.spaces.length}</p>
      <p className="arrow">{open?"▲":"▼"}</p>

    </div>
    <div className="spaces" style={{display: open?"flex":"none"}}>
      {props.data.spaces.map((space) => <SpaceBox key={space._id} data={space} updateMe={updateSpace} deleteMe={deleteSpace} />)}
      {loggedIn?<NewSpaceBox sectionID={props.data._id} createMe={addSpace}/>:<></>}
    </div>
    </>
  )

}

export default Section;
