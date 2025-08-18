import axios from "axios";
import type { Quiz, QuizDTO } from "./types";
import { 
  convertQuizDTOToQuiz, 
  convertQuizToQuizDTO
} from "./types";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/quiz-attempts`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const findQuizById = async (quizId: string): Promise<Quiz> => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  const dto: QuizDTO = response.data;
  return convertQuizDTOToQuiz(dto);
};

export const updateQuiz = async (quizId: string, quiz: Quiz): Promise<Quiz> => {
  const dto = convertQuizToQuizDTO(quiz);
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, dto);
  const responseDTO: QuizDTO = response.data;
  return convertQuizDTOToQuiz(responseDTO);
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// for StudentQuiz component
export const getStudentAttempts = async (quizId: string, studentId: string): Promise<any[]> => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/quiz/${quizId}/student/${studentId}`);
  // TODO: 如果需要，这里也可以转换 QuizAttempt 类型
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
export const submitQuizAttempt = async (quizId: string, answers: any, timeSpent?: number) => {
  const response = await axiosWithCredentials.post(`${ATTEMPTS_API}/quiz/${quizId}/submit`, {
    answers,
    timeSpent
  });
  return response.data;
};