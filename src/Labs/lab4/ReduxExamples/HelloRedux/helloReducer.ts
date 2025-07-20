import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  message: "Hello World",
};
const helloSlice = createSlice({
  name: "hello",
  initialState,
  reducers: {},
});
export default helloSlice.reducer;

// State is just a fancy word for data that your app remembers.
// In Redux, the state is stored in a single object called the store.
// The store is like a big box that holds all the data your app needs.
// You can think of it like a database, but it's all in memory and managed by Redux.
// Actions are like messages that tell Redux what to do.
// They describe something that happened in your app, like a user clicking a button or submitting a form.
// Actions are plain JavaScript objects with a type property that describes the action.


// The reducer takes two things:
// 	•	the current state
// 	•	an action (something that wants to change the state)
// And it returns a new version of the state.

// In the context of a specific reducer, “the current state” refers to just 
// the slice of state that this reducer manages — not the entire app’s global state.


// Reducers are functions that take the current state and an action, and return a new state.
// They are pure functions, meaning they don't change the original state but return a new one based on the action.
// Reducers are the heart of Redux, as they define how the state changes in response to actions.
// The store is created using the configureStore function from Redux Toolkit.


