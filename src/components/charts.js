import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { Provider, createClient, useQuery } from "urql";
import { useSelector } from 'react-redux';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
  query($input: MeasurementQuery!) {
    getMeasurements(input: $input) {
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

const Charts = props => {
  let metric = useSelector((state) => state.metric)
  console.log();
  const initialState = {
    data: []
  };
  const [state, setState] = useState(initialState);
  let input = { metricName: metric };
  
  const [result] = useQuery({
    query,
    variables: {
      input
    }
  });

  const { fetching, data, error } = result;
  
  useEffect(() => {
    
      if (!data) return;
      const { getMeasurements } = data;
      setState({ data: [...getMeasurements] });
     
  }, [data]);

  return (
    <LineChart
      width={1200}
      height={600}
      data={state.data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="at" />
      <YAxis />
    </LineChart>
  );
};
