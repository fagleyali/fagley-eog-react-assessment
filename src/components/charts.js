import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { Provider, createClient, useQuery } from "urql";
import { useSelector } from 'react-redux';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});


const query = `
  query($input: MeasurementQuery!) {
    getMeasurements(input:$input){
      metric
      at
      value
      
    }
  }
  `;

export default () => {
  return (
    <Provider value={client}>
      <Charts />
    </Provider>
  );
};

const Charts = props => {
  let metric = useSelector((state) => state.metric)

  const initialState = {
    results: [],
    timeData: []
  };
  const [state, setState] = useState(initialState);
  let input = { metricName: metric };

  

    
      let [result] = useQuery({
        query,
        variables: {
          input
        }
      })
    
    
  
  

  const { fetching, data, error } = result;

  const timeRange = (arr) => {
    if(!arr && arr.length>0) return;
    let timeArr = [];
    if(arr.length > timeArr.length) {
      timeArr = arr;
    }
    console.log(timeArr)
    return timeArr
  }

  useEffect(() => {

    if (!data) return;
    const { getMeasurements } = data;
    let startTime = Date.now() - (30 * 60 * 1000);
    let renderData = getMeasurements.filter(e => e.at > startTime);
    renderData.forEach(e=>e.at=new Date(e.at).getHours()+':'+new Date(e.at).getMinutes())
    let timeData = timeRange(renderData);
    setState({ results: [...state.results,renderData], timeData: timeData });
    console.log(state.timeData)
  }, [data]);

  return (
    <div>
      <LineChart
        width={1200}
        height={600}
        data={state.results}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {state.results.map(result=> (

          <Line type="monotone" data={result} dataKey="value" stroke="#8884d8" key={result.metric} />
        ))}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        
        <XAxis allowDataOverflow top={state.timeData && state.timeData.length > 0 ? Math.min(...state.timeData):0} bottom={state.timeData && state.timeData.length > 0 ? Math.max(...state.timeData):0} date={state.timeData} dataKey="at" key={result.metric} />
      
        <YAxis allowDataOverflow/>
      </LineChart>
    </div>
  );
};
