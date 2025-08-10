import axios from "axios";
import type { Quiz, QuizAttempt, QuizFormData } from "./types";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/quiz-attempts`;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Quiz CRUD operations
export const createQuiz = async (quiz: QuizFormData, courseId: string) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}`, { ...quiz, courseId });
  return response.data;
};

export const findAllQuizzes = async () => {
  const response = await axiosWithCredentials.get(QUIZZES_API);
  return response.data;
};

export const findQuizzesByCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/course/${courseId}`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId: string, quiz: QuizFormData) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const publishQuiz = async (quizId: string, isPublished: boolean) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, { isPublished });
  return response.data;
};

// Quiz Attempt operations
export const submitQuizAttempt = async (attempt: Omit<QuizAttempt, '_id' | 'submittedAt'>) => {
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
