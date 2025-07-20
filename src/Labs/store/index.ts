import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../lab4/ReduxExamples/HelloRedux/helloReducer";

const store = configureStore({
  reducer: { 
    hello: helloReducer 
  }
});

export default store;

// The store is created using the configureStore function from Redux Toolkit.
// It combines all the reducers into a single store object.


//  configureStore is a function (not a constructor), and…

// It requires an object with at least a reducer key. That reducer can be:
// 	•	a single reducer, or
// 	•	an object of multiple reducers, each managing a different “slice” of the state.

// 🧠 So how do we add more reducers?

// We pass an object to configureStore, where:
// 	•	each key becomes a slice of the global state
// 	•	each value is a reducer function