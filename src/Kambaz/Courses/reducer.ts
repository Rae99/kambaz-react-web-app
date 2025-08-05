import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCourses: [],        // holds all courses fetched from server
  enrolledCourses: [],   // holds just the user's enrolled courses
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setAllCourses: (state, action) => {
      state.allCourses = action.payload;     // update all courses
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload; // update enrolled courses
    },
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
      state.allCourses = [...state.allCourses, newCourse] as any;
      state.enrolledCourses = [...state.enrolledCourses, newCourse] as any;
    },
    deleteCourse: (state, action) => {
      state.allCourses = state.allCourses.filter((course: any) => course._id !== action.payload);
      state.enrolledCourses = state.enrolledCourses.filter((course: any) => course._id !== action.payload);
    },
    updateCourse: (state, action) => {
      state.allCourses = state.allCourses.map((course: any) =>
        course._id === action.payload._id ? action.payload : course
      ) as any;
      state.enrolledCourses = state.enrolledCourses.map((course: any) =>
        course._id === action.payload._id ? action.payload : course
      ) as any;
    },
  },
});

export const {
  setAllCourses,
  setEnrolledCourses,
  addCourse,
  deleteCourse,
  updateCourse,
} = courseSlice.actions;
export default courseSlice.reducer;