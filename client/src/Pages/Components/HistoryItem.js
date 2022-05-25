
import "../styles/HistoryItem.css";

function HistoryItem(props) {
  const since = new Date(props.data.since)
  const to = new Date(props.data.to)
  const spent = new Date(to.getTime()-since.getTime());

  return (
    <div className="historyitem">
      <p>{props.data.section.name}</p>
      <p>{props.data.space.name}</p>
      <p>{since.toLocaleTimeString()+" "+since.toLocaleDateString()}</p>
      <p>{to.toLocaleTimeString()+" "+to.toLocaleDateString()}</p>
      <p>{Math.floor(spent.getTime()/1000/60/60)} Hrs {Math.floor((spent.getTime()/1000/60/60)%1*60)} Min  </p>
      <p>{Math.round(props.data.cost*100)/100}$</p>
    </div>
  )
}

export default HistoryItem;
