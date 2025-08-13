import axios from "axios";
import type { QuizAttempt, Quiz } from "./types";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/quiz-attempts`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const findAllQuizzes = async () => {
  const response = await axiosWithCredentials.get(QUIZZES_API);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId: string, quiz: Quiz) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Quiz Attempt operations
export const createQuizAttempt = async (attempt: Omit<QuizAttempt, '_id' | 'submittedAt'>) => {
  const response = await axiosWithCredentials.post(ATTEMPTS_API, attempt);
  return response.data;
};

export const findQuizAttemptsByStudent = async (studentId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/student/${studentId}`);
  return response.data;
};

export const findQuizAttemptsByQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/quiz/${quizId}`);
  return response.data;
};

export const findQuizAttemptById = async (attemptId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/${attemptId}`);
  return response.data;
};

export const findQuizAttemptsByCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/course/${courseId}`);
  return response.data;
};

// Additional functions for StudentQuiz component
export const getStudentAttempts = async (quizId: string, studentId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/quiz/${quizId}/student/${studentId}`);
  return response.data;
};

// New simplified API for saving quiz progress
export const saveQuizProgress = async (quizId: string, answers: any, timeSpent?: number) => {
  const response = await axiosWithCredentials.put(`${ATTEMPTS_API}/quiz/${quizId}`, {
    answers,
    timeSpent
  });
  return response.data;
};

// Submit quiz (final submission)
export const submitQuizAttempt = async (quizId: string, answers: any) => {
  const response = await axiosWithCredentials.post(`${ATTEMPTS_API}/quiz/${quizId}/submit`, {
    answers
  });
  return response.data;
};

// Legacy function - keeping for backward compatibility but prefer saveQuizProgress
export const saveStudentAttempt = async (attempt: QuizAttempt) => {
  const response = await axiosWithCredentials.post(ATTEMPTS_API, attempt);
  return response.data;
};