import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import courseReducer from "./Courses/reducer";
import enrollmentsReducer from "./Courses/enrollmentsReducer";
import quizzesReducer from "./Courses/Quizzes/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    courseReducer,
    enrollmentsReducer,
    quizzesReducer,
  },
});
export default store;