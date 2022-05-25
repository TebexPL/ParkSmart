import {useState, useEffect } from "react";
import GeneralStatistics from "./Components/GeneralStatistics.js"
import StatisticsSection from "./Components/StatisticsSection.js"

import "./styles/Statistics.css";

function History(props) {
  const token = localStorage.getItem('token');

  const [history, setHistory] = useState([]);
  const [sections, setSections] = useState([]);
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {

    async function fetchData(){
      try {

        const res = await fetch("https://park--smart.herokuapp.com/api/history", {
          method: "GET",
          headers: {'authorization': token},
        })
        if(res.status === 401){
          localStorage.removeItem('token');
          window.location.replace("/");
        }

        const historyData = await res.json();
        const spacesData = await (await fetch("https://park--smart.herokuapp.com/api/space")).json();
        const sectionsData = await (await fetch("https://park--smart.herokuapp.com/api/section")).json();

        for(let section of sectionsData){
          const spaces = await (await fetch("https://park--smart.herokuapp.com/api/space/"+section._id)).json();
          section.spaces=spaces;
        }


        for(let item of historyData){
          const section = sectionsData.find(el => el._id === item.sectionID);
          const space = section.spaces.find(el => el._id === item.spaceID);

          item.section = section;
          item.space = space;
        }
        setHistory(historyData);
        setSections(sectionsData);
        setSpaces(spacesData);

      }
      catch(error){
        console.log(error);
      }
    }


    props.socket.on("statistics", data => {
       for(let section of data.sections){
         section.spaces = data.spaces.filter(e => e.sectionID === section._id);
       }
       for(let item of data.history){
         const section = data.sections.find(el => el._id = item.sectionID);
         const space = section.spaces.find(el => el._id = item.spaceID);

         item.section = section;
         item.space = space;
       }

        setHistory(data.history);
    });

    fetchData();

  }, [token])

  if(history.length === 0)
    return(
      <div className="Load">
        Loading...
      </div>
    )


  return (
    <div className="statistics">
      <h3>General statistics</h3>
      <GeneralStatistics data={history} sections={sections} spaces={spaces}/>
      <h3>Section statistics</h3>
      {sections.map((data) => <StatisticsSection data={data} history={history} key={data._id}/>)}


    </div>

  )

}

export default History;
