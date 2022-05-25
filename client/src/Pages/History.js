import {useState, useEffect } from "react";
import HistoryItem from "./Components/HistoryItem.js";
import HistoryHeader from "./Components/HistoryHeader.js";

import "./styles/History.css";

function History(props) {
  const token = localStorage.getItem('token');

  const [history, setHistory] = useState(undefined);

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

        const data = await res.json();
        const sectionsData = await (await fetch("https://park--smart.herokuapp.com/api/section")).json();

        for(let section of sectionsData){
          const spaces = await (await fetch("https://park--smart.herokuapp.com/api/space/"+section._id)).json();
          section.spaces=spaces;
        }


        for(let item of data){
          const section = sectionsData.find(el => el._id === item.sectionID);
          const space = section.spaces.find(el => el._id === item.spaceID);

          item.section = section;
          item.space = space;
        }


        setHistory(data.reverse());

      }
      catch(error){
        console.log(error);
      }
    }


    props.socket.on("history", data => {
       for(let section of data.sections){
         section.spaces = data.spaces.filter(e => e.sectionID === section._id);
       }
       for(let item of data.history){
         const section = data.sections.find(el => el._id === item.sectionID);
         const space = section.spaces.find(el => el._id === item.spaceID);

         item.section = section;
         item.space = space;
       }
        setHistory(data.history.reverse());
    });

    fetchData();

  }, [token, props.socket])

  if(history === undefined)
    return(
      <div className="Load">
        Loading...
      </div>
    )


  return (
    <div className="history">

      <HistoryHeader />
    {history.map((space) => (
      <HistoryItem data={space}/>

    ))}
    </div>

  )

}

export default History;
