import React, { useState } from "react";
import SelectMetrics from "./components/selectMetrics";
import Charts from "./components/charts";



import "./App.css";
import { Subscription } from "urql";





function App() {
  const initialState = {
    metricName: "waterTemp"
  };
  const [state, setState] = useState(initialState);
  return (
    <div className="App">
      <h1>EOG REACT ASSESSMENT</h1>
      <SelectMetrics />
      <Charts metricName={state.metricName} />
      
    </div>
  );
}

export default App;
