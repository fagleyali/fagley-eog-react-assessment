import action from "./action";

const initialState = {
  metric: "",

  measurements: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_METRIC": {
      const { content } = action.payload;
      return {
        metric: content
      };
    }

    case "SET_MEASUREMENTS": {
      const { contents } = action.payload;
      return {
        measurements: contents
      };
    }
    default:
      return state;
  }
};

export default reducer;
