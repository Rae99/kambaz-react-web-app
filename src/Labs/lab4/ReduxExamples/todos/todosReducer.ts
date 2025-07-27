import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { title: "Learn Mongo" },
};
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodos = [
          ...state.todos,
        { ...action.payload, id: new Date().getTime().toString() },
      ];
      state.todos = newTodos;
      state.todo = { title: "" };
    },
    deleteTodo: (state, action) => {
      const newTodos = state.todos.filter((todo) => todo.id !== action.payload);
      state.todos = newTodos;
    },
    updateTodo: (state, action) => {
      const newTodos = state.todos.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      state.todos = newTodos;
      state.todo = { title: "" };
    },
    setTodo: (state, action) => {
      state.todo = action.payload;
    },
  },
});
export const { addTodo, deleteTodo, updateTodo, setTodo } = todosSlice.actions;
export default todosSlice.reducer;



// export const { addTodo, deleteTodo, updateTodo, setTodo } = todosSlice.actions;

// Exports four action creators.
// Each of these is a function you will call from a UI component:dispatch(addTodo(...)),
//  dispatch(deleteTodo(...)), etc.
// When you call one of them it returns an action object such as:
// { type: "todos/addTodo", payload: { title: "Run" } }and
// dispatch sends that object to the store.

// export default todosSlice.reducer;


// Exports one reducer function (the “big switch” that handles all actions for this slice).
// You give that reducer to configureStore:configureStore({ reducer: { todos: todosReducer } }).
// When an action arrives, Redux picks the right slice reducer (here todosReducer) to produce the next state.
