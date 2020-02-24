import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Provider,
  createClient,
  useQuery,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
  useSubscription
} from "urql";

import { useSelector } from "react-redux";
import { cacheExchange } from '@urql/exchange-graphcache';
import { SubscriptionClient } from "subscriptions-transport-ws";


import uuid from 'uuid';


export const subQuery = `
subscription {
  newMeasurement {
    metric
    at
    value
    unit
  }
}
`;  

export const subClient = new SubscriptionClient(
    "wss://react.eogresources.com/graphql",
    {
      reconnect: true
    }
  );

  // const cache = cacheExchange({
  //   keys: uuid(),
  //   updates: {
  //     Subscription: {
  //       newMeasurement: ({newMeasurement}, _args, cache) => {
  //         const variables = { first: 100, skip: 0, orderBy: 'at_DESC'}
  //         cache.updateQuery({query: query, variables}, data => {
  //           if(data !== null) {
  //             data.getMeasurements.unshift(newMeasurement)
  //             console.log(data)
  //             return data;
  //           }else {
  //             return null
  //           }
  //         })
  //       }
  //     }
  //   }
  // })

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    dedupExchange,
    // cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subClient.request(operation)
    })
  ]
});

const query = `
  query($input: MeasurementQuery!) {
    getMeasurements(input:$input){
      metric
      at
      value
      unit
      
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
let renderData=[]
let xTicks = []

const Charts = props => {
  let metric = useSelector(state => state.metric);
  let input = { metricName: metric };

  // const [subResult] = 
  // useSubscription({
  //   query: subQuery,
    
  // });
  
  let [result] = useQuery({
    query,
    variables: {
      input
    }
  });

  // if (!subResult.data) return null
  // let newData = subResult.data.newMeasurement
  // console.log(newData)
  
  const { fetching, data, error } = result;
  if (fetching) return <div>Fetching</div>
  if (error) return <div>Error</div>
  if (!data) return;
    const { getMeasurements } = data;
    // if(getMeasurements.length > 0 && getMeasurements[0].metric === newData.metric){
    //   // console.log(getMeasurements[0].metric)
    //   getMeasurements.unshift(newData)
    // }
    // console.log(getMeasurements[0])
    if(getMeasurements && getMeasurements.length > 0){

      let startTime = Date.now() - (30 * 60 * 1000);
      renderData.unshift(getMeasurements.filter(e => e.at > startTime));
      
    }
    
  const metColor = metName => {
    if (metName === "waterTemp") return "magenta";
    if (metName === "casingPressure") return "blue";
    if (metName === "injValveOpen") return "green";
    if (metName === "flareTemp") return "brown";
    if (metName === "oilTemp") return "red";
    if (metName === "tubingPressure") return "purple";
  };
  const tickCounter = unit => {
    if (unit === "PSI") return "10";
    if (unit === "%") return "11";
    if (unit === "F") return "15";
  };

 const formatXAxis = (tickItem) => {
  return new Date(tickItem).getHours() + ':' + new Date(tickItem).getMinutes()
 } 
  
  return (
    <div>
     
      <LineChart
        width={1200}
        height={600}
        data={ renderData }
        
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {renderData.map(result =>
          result && result.length > 0 ? (
            
            <Line
              type="monotone"
              yAxisId={result[0].unit}
              data={result}
              dataKey="value"
              stroke={metColor(result[0].metric)}
              key={uuid()}
              dot={false}
            />
          ) : null
        )} 
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
        <XAxis
          allowDataOverflow
          type="number"
          // domain={[Date.now() - 30 * 10 * 1000, Date.now()]}
          domain={['dataMin', 'dataMax']}
          key={uuid()}
          tickCount="6"
          dataKey='at'
          tickFormatter={formatXAxis}
          padding={{ left: 30, right: 30 }}
          
          // ticks = {[1582514389831, 1582514699697, 1582515011105, 1582515320537, 1582515629314, 1582515939090   ]}
        />

        {renderData.map(result =>
          result && result.length > 0 ? (
            
          
            <YAxis
              label={{
                value: result[0].unit,
                angle: -150,
                position: "insideTopLeft"
              }}
              allowDataOverflow
              yAxisId={result[0].unit}
              tickCount={tickCounter(result[0].unit)}
              dataKey="value"
              key={uuid()}
            />
            ) : null
        )} 
       
      </LineChart>
      
    </div>
  );
};
