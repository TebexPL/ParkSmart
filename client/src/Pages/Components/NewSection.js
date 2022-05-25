import "../styles/Section.css";


function NewSection(props) {

  const token = localStorage.getItem('token');
  async function createSection() {
    const nameBox = document.getElementById("newNameBox");
    const costBox = document.getElementById("newCostBox");
    if(!nameBox.value){
        nameBox.placeholder = "Feld required";
        return;
    }
    if(!costBox.value){
        costBox.value = "";
          costBox.placeholder = "Valid input required";
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
    costBox.placeholder = "Creating...";
    nameBox.placeholder = "Creating...";

    try{
      const res = await fetch("https://park--smart.herokuapp.com/api/section", {
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
        costBox.value = "";
        nameBox.placeholder="New section name"
        costBox.placeholder = "New section cost";
      }
      else{
        const result = await res.json();
        props.createMe(result);
        nameBox.placeholder="New section name"
        costBox.placeholder = "New section cost";
        costBox.value = "";
        nameBox.value = "";
      }



    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <>
    <div className="trigDiv" >
      <input id={"newNameBox"} placeholder="New section name"/>
      <input id={"newCostBox"} placeholder="New section cost" type="number" />
      <div>
      <button onClick={createSection}>Create</button>
      </div>
      <p className="arrow"></p>
      <p className="arrow"></p>

    </div>

    </>
  )

}

export default NewSection;
