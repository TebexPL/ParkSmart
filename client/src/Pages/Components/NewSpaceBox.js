
import "../styles/SpaceBox.css";


function NewSpaceBox(props) {

    const token = localStorage.getItem('token');

    async function createSpace() {
      const nameBox = document.getElementById(props.sectionID+"newNameBox");
      if(!nameBox.value){
          nameBox.placeholder = "Required";
          return;
      }

      const data = {}
      data.name = nameBox.value;
      data.sectionID = props.sectionID;

      nameBox.value = "";
      nameBox.placeholder = "Creating...";

      try{
        const res = await fetch("https://park--smart.herokuapp.com/api/space", {
          method: "POST",
          headers: {'authorization': token, 'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        if(res.status === 401){
          localStorage.removeItem('token');
          window.location.replace("/");
        }
        else if(res.status === 400 ||res.status === 409 ){
          nameBox.value = "";
          nameBox.placeholder="Name"
        }
        else{
          const result = await res.json();
          props.createMe(result);
          nameBox.value = "";
          nameBox.placeholder="Name"
        }



      }
      catch(error){
        console.log(error);
      }
    }

  return (
    <div className="spaceDiv">
        <p>New space</p>
        <input id={props.sectionID+"newNameBox"} placeholder="Name" />
        <button onClick={()=>createSpace()}>Create</button>
        <p></p>

    </div>
  )

}

export default NewSpaceBox;
