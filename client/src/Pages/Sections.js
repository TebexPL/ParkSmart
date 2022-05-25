import {useState, useEffect } from "react";
import "./styles/Sections.css";
import Section from "./Components/Section.js";
import NewSection from "./Components/NewSection.js";
import SectionHeader from "./Components/SectionHeader.js";

import { isExpired } from "react-jwt";


function Sections(props) {
  const [sections, setSections] = useState(undefined);
    const loggedIn = !isExpired(localStorage.getItem('token'));


  useEffect(() => {

    async function fetchData(){
      try {
        const data = await (await fetch("http://localhost:3001/api/section")).json();

        for(let section of data){
          const spaces = await (await fetch("http://localhost:3001/api/space/"+section._id)).json();
          section.spaces=spaces;
          section.expanded=false;
        }
        setSections(data);
      }
      catch(error){
        console.log(error);
      }
    }




     props.socket.on("sections", data => {
        for(let section of data.sections){
          section.spaces = data.spaces.filter(e => e.sectionID === section._id);
        }
         setSections(data.sections);
     });



    fetchData();

  }, [props.socket])


  function deleteSection(sectionID){
    setSections(sections.filter((e) => e._id !== sectionID))
  }

  function updateSection(section){
    sections.find((e)=> e._id === section._id).name=section.name;
    sections.find((e)=> e._id === section._id).cost=section.cost;
    setSections([...sections])
  }

  function addSection(section){
    section.spaces=[];
    sections.push(section);
    setSections([...sections])
  }

  function addSpace(sectionID, space){
    const section = sections.find((e)=> e._id === sectionID)
    section.spaces.push(space);
    setSections([...sections])
  }


  function deleteSpace(sectionID, spaceID){
    const section = sections.find((e)=> e._id === sectionID)
    section.spaces = section.spaces.filter((e) => e._id !== spaceID)
    setSections([...sections])
  }

  function updateSpace(sectionID, space){
    const section = sections.find((e)=> e._id === sectionID)
    section.spaces.find((e)=> e._id === space._id).name = space.name
    setSections([...sections])
  }

  function rerender(){
    setSections([...sections])
  }




  if(sections===undefined)
    return(
      <div className="Load">
        Loading...
      </div>
    )



  return (

    <div className="sectionsMain">
    <SectionHeader />
    {sections.map((section) => <Section rerender={rerender} data={section} deleteMe={deleteSection} updateMe={updateSection} deleteSpace={deleteSpace} updateSpace={updateSpace} addSpace={addSpace} key={section._id}/>)}
    {loggedIn?<NewSection createMe={addSection}/>:<></>}
    </div>

  )

}

export default Sections;
