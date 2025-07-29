import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";

const initialState = {
  courses: courses,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, action) => {
      const newCourse = {
        _id: action.payload._id,
        name: action.payload.name,
        number: action.payload.number,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        department: action.payload.department,
        credits: action.payload.credits,
        description: action.payload.description,
      };
      state.courses = [...state.courses, newCourse] as any;
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter((course: any) => course._id !== action.payload);
    },
    updateCourse: (state, action) => {
      state.courses = state.courses.map((course: any) =>
        course._id === action.payload._id ? action.payload : course
      ) as any;
    },
  },
});

export const { addCourse, deleteCourse, updateCourse } = courseSlice.actions;
export default courseSlice.reducer;