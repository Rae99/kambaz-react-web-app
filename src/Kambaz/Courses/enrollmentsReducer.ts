import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";  

const initialState = {
  enrollments:[]
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      // Check if enrollment already exists
      const existingEnrollment = state.enrollments.find(
        (enrollment: any) => 
          enrollment.user === userId && enrollment.course === courseId
      );
      
      if (!existingEnrollment) {
        const newEnrollment = {
          _id: uuidv4(),
          user: userId,
          course: courseId,
        };
        state.enrollments = [...state.enrollments, newEnrollment] as any;
      }
    },
    unenrollFromCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment: any) => 
          !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
  },
});

export const { enrollInCourse, unenrollFromCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer; 