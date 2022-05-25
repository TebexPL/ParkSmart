import {useState} from "react";
import "../styles/StatisticsSection.css";
import _ from "lodash"
import moment from "moment"
import Calendar from 'react-calendar'


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsSection(props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const halfhours = Array(24*2).fill(0).map((e, i) => {return ((Math.floor(i/2))<10?"0":"")+(Math.floor(i/2))+":"+(((i*30)%60)===0?"0":"")+((i*30)%60)})

  const [hourlyUsage, setHourlyUsage] = useState({
    labels: halfhours,
    datasets: [
      {
        label: 'Taken spaces',
        data: [],
        borderColor: '#777777',
        backgroundColor: '#777777',
      },
    ],
  })




  const thisHistory =props.history.filter((obj) => obj.sectionID === props.data._id)


  const months =  _.groupBy(thisHistory, function (obj) {
                    return moment(obj.to).startOf('month').format();
                  });

  const days =  _.groupBy(thisHistory, function (obj) {
                    return moment(obj.to).startOf('day').format();
                  });


  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly income',
    },
  },
  scales: {
    yAxes: {
        grid: {
          color: "#444444"
        }

    },
    xAxes: {

        grid: {
          color: "#444444"
        }

    }
  }
};



  const monthlyOptions = JSON.parse(JSON.stringify(options));
  monthlyOptions.plugins.title.text = "Monthly income"

  const dailyOptions = JSON.parse(JSON.stringify(options));
  dailyOptions.plugins.title.text = "Daily income - last month"

  const hourlyOptions = JSON.parse(JSON.stringify(options));
  hourlyOptions.plugins.title.text = "Usage";

  const monthlyIncome = {
    labels: Object.keys(months).map((e) => ((new Date(e)).getMonth()+1)+"/"+(new Date(e)).getFullYear()),
    datasets: [
      {
        label: 'Income ($)',
        data: Object.values(months).map((x) => x.reduce((a, b)=> +a+b.cost,0)),
        borderColor: '#777777',
        backgroundColor: '#777777',
      },
    ],
  };

  const dailyIncome = {
    labels: Object.keys(days).slice(Math.max(Object.keys(days).length - 30, 1)).map((e) => ((new Date(e)).getDate()+1)+"/"+((new Date(e)).getMonth()+1)+"/"+(new Date(e)).getFullYear()),
    datasets: [
      {
        label: 'Income ($)',
        data: Object.values(days).slice(Math.max(Object.values(days).length - 30, 1)).map((x) => x.reduce((a, b)=> +a+b.cost,0)),
        borderColor: '#777777',
        backgroundColor: '#777777',
      },
    ],
  };



  const dateChanged = function(date){

    const thatDay = days[Object.keys(days).find((e) => (new Date(e)).getTime()===date.getTime())];
    if(!thatDay)
      return;
    const data = [];
    const hour = new Date(date)
    for(let halfhour in halfhours){
      data.push(thatDay.filter((e) => (new Date(e.since)).getTime()<hour.getTime() && (new Date(e.to)).getTime()>hour.getTime()).length)
      hour.setMinutes(hour.getMinutes()+30);
    }

    setHourlyUsage({
      labels: halfhours,
      datasets: [
        {
          label: 'Taken spaces',
          data: data,
          borderColor: '#777777',
          backgroundColor: '#777777',
        },
      ],
    })
    setDate(date);
  }

  return (
    <>
    <div className="trigDiv" onClick={() => setOpen(!open)}>
        <p>{props.data.name}</p>


      <p className="arrow">{open?"▲":"▼"}</p>

    </div>
    <div className="statisticsSection" style={{display: open?"flex":"none"}}>
      <h3 style={{width:"100%"}}>Income statistics</h3>
      <div className="line"><Line data={monthlyIncome} options={monthlyOptions} /></div>
      <div className="line"><Line data={dailyIncome} options={dailyOptions} /></div>
      <h3 style={{width:"100%"}}>Daily usage</h3>
      <div className="line"><div className="calendar"><Calendar onChange={dateChanged}/></div></div>
      <div className="line">{Object.keys(days).find((e) => (new Date(e)).getTime()===date.getTime())?<Line data={hourlyUsage} options={hourlyOptions}/>:<h3>No data</h3>} </div>



    </div>
    </>
  )

}

export default StatisticsSection;
