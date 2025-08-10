import { createSlice } from "@reduxjs/toolkit";
import type { Quiz, QuizAttempt } from "./types";

interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  attempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  attempts: [],
  loading: false,
  error: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action) => {
      state.quizzes.push(action.payload);
    },
    updateQuiz: (state, action) => {
      const index = state.quizzes.findIndex(q => q._id === action.payload._id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    deleteQuiz: (state, action) => {
      state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    setAttempts: (state, action) => {
      state.attempts = action.payload;
    },
    addAttempt: (state, action) => {
      state.attempts.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  setCurrentQuiz,
  setAttempts,
  addAttempt,
  setLoading,
  setError,
  clearError,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
