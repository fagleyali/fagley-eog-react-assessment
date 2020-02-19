import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Provider,
  createClient,
  useQuery,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
  useSubscription
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useSelector } from "react-redux";

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    dedupExchange,

    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const subscriptionClient = new SubscriptionClient(
  "wss://react.eogresources.com/graphql",
  {
    reconnect: true
  }
);

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

// const subscription = `
// subscription {
//   newMeasurement {
//     metric
//     at
//     value
//     unit
//   }
// }
// `;

export default () => {
  return (
    <Provider value={client}>
      <Charts />
    </Provider>
  );
};

let subData = [];
const Charts = props => {
  let metric = useSelector(state => state.metric);

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

  const initialState = {
    results: []
  };
  const [state, setState] = useState(initialState);
  let input = { metricName: metric };

  let [result] = useQuery({
    query,
    variables: {
      input
    }
  });

  // let subResult = useSubscription({
  //   query: subscription
  // })
  // const { fetching, data, error } = subResult;
  // const handleSub = () => {

  //   if( subResult[0].data){

  //     subData.push(subResult[0].data.newMeasurement);
  //     setState({results: [...state.results, ...subData]});
  //     console.log(state.results);
  //   }
  // }

  const { fetching, data, error } = result;

  useEffect(() => {
    if (!data) return;
    const { getMeasurements } = data;
    let startTime = Date.now() - 30 * 60 * 1000;
    let renderData = getMeasurements.filter(e => e.at > startTime);
    setState({ results: [...state.results, renderData] });
   
  });

  return (
    <div>
      <LineChart
        width={1200}
        height={600}
        data={state.results}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {state.results.map(result =>
          result && result.length > 0 ? (
            <Line
              type="monotone"
              yAxisId={result[0].unit}
              data={result}
              dataKey="value"
              stroke={metColor(result[0].metric)}
              key={result[0].metric}
              dot={false}
            />
          ) : null
        )}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

        <XAxis
          allowDataOverflow
          type="number"
          domain={[Date.now() - 30 * 10 * 1000, Date.now()]}
          key={new Date()}
          tickCount="6"
          dataKey="at"
          padding={{ left: 30, right: 30 }}
        />

        {state.results.map(result =>
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
            />
          ) : null
        )}
      </LineChart>
    </div>
  );
};
