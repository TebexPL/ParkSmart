import _ from "lodash"
import moment from "moment"

import "../styles/GeneralStatistics.css"

function GeneralStatistics(props) {


  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth()-1);

  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear()-1);
  const days =  _.groupBy(props.data, function (obj) {
                    return moment(obj.to).startOf('day').format();
                  });
  const months =  _.groupBy(props.data, function (obj) {
                    return moment(obj.to).startOf('month').format();
                  });

  const sectionHistory = _.groupBy(props.data, function (obj) {
                    return obj.sectionID;
                  });

  const last30DaysIncome = Math.round(props.data.filter((e)=> (new Date(e.to)).getTime() > monthAgo.getTime()).reduce((a, b) => +a+b.cost, 0)*100)/100;
  const last12MonthsIncome = Math.round(props.data.filter((e)=> (new Date(e.to)).getTime() > yearAgo.getTime()).reduce((a, b) => +a+b.cost, 0)*100)/100;
  const allTimeIncome = Math.round(props.data.reduce((a, b) => +a+b.cost, 0)*100)/100;
  const avgDailyIncome = Math.round(Object.values(days).reduce((a, b)=>+a+(b.reduce((a,b)=>+a+b.cost, 0)),0)/Object.values(days).length*100)/100;
  const avgMonthlyIncome = Math.round(Object.values(months).reduce((a, b)=>+a+(b.reduce((a,b)=>+a+b.cost, 0)),0)/Object.values(months).length*100)/100

  const mostPopularSection = Object.values(sectionHistory).reduce((a, b) => a<b.length?b:a, 0)[0].section.name;
  const leastPopularSection = Object.values(sectionHistory).reduce((a, b) => a>b.length?b:a,Object.values(sectionHistory)[0].length)[0].section.name;
  const avgParkingHrs = Math.floor(props.data.reduce((a, b) => +a+((new Date(b.to)).getTime()-(new Date(b.since)).getTime())/1000/60/60, 0)/props.data.length);
  const avgParkingMins = Math.floor(((props.data.reduce((a, b) => +a+((new Date(b.to)).getTime()-(new Date(b.since)).getTime())/1000/60/60, 0)/props.data.length)%1)*60)

  return (

  <div className="General">
    <div className="Income">
      <h3>Income statistics</h3>
      <p>Income in last 30 days:</p><p> {last30DaysIncome}$</p>
      <p>Income in last 12 months:</p><p> {last12MonthsIncome}$</p>
      <p>All time income:</p><p> {allTimeIncome}$</p>
      <p>Average daily income:</p><p> {avgDailyIncome}$</p>
      <p>Average monthly income</p><p> {avgMonthlyIncome}$</p>
    </div>
    <div className="Income">
      <h3>Usage statistics</h3>
      <p>Current usage:</p><p>{props.spaces.filter((s) => s.taken).length}/{props.spaces.length} taken spaces</p>
      <p>Average parking time</p><p>{avgParkingHrs} Hrs {avgParkingMins} Min</p>
      <p>Most popular section:</p><p> {mostPopularSection}</p>
      <p>Least popular section:</p><p> {leastPopularSection}</p>
    </div>
  </div>
  )

}

export default GeneralStatistics;
