import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sum: 0,
};
const addSlice = createSlice({
  name: "add",
  initialState,
  reducers: {
    add: (state, action) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});
export const { add } = addSlice.actions;
export default addSlice.reducer;

// What is payload?

// In Redux, when you dispatch an action, you’re sending an object like this:
// {
//   type: "add/add",
//   payload: {
//     a: 3,
//     b: 4
//   }
// }
// So the payload is just the extra data you send along with the action — the information your reducer needs to update the state.
