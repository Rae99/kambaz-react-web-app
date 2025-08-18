// DTO Types - 用于网络传输，日期为 ISO 字符串
export interface QuizDTO {
  _id?: string;
  title: string;
  description: string;
  courseId: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptsAllowed: number;
  showCorrectAnswers: string;
  customShowDate?: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  availableDate?: string | null; // ISO 8601  "2024-01-01T00:00:00.000Z"
  dueDate?: string | null;       // ISO 8601  "2024-01-01T00:00:00.000Z"
  untilDate?: string | null;     // ISO 8601  "2024-01-01T00:00:00.000Z"
  questions: Question[];
  isPublished: boolean;
  createdAt: string;      // ISO 8601  "2024-01-01T00:00:00.000Z"
  updatedAt: string;      // ISO 8601  "2024-01-01T00:00:00.000Z"
}

// UI Model Types - 用于组件内部，日期为 Date 对象
export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  courseId: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptsAllowed: number;
  showCorrectAnswers: string;
  customShowDate?: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  availableDate?: Date | null; // UI 使用 Date 对象
  dueDate?: Date | null;       // UI 使用 Date 对象
  untilDate?: Date | null;     // UI 使用 Date 对象
  questions: Question[];
  isPublished: boolean;
  createdAt: Date;      // UI 使用 Date 对象
  updatedAt: Date;      // UI 使用 Date 对象
}

export interface Question {
  _id?: string;
  title?: string; // Question title
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  text: string;
  points: number;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[]; // single answer or array for multiple correct answers
  explanation?: string;
  // New fields for fill-in-the-blank
  blanks?: BlankOption[]; // For fill-in-the-blank questions
}

export interface BlankOption {
  id: string; // unique identifier for the blank
  options: string[]; // dropdown options for this blank
  correctAnswer: string; // which option is correct for this blank
}

// DTO Types for QuizAttempt
export interface QuizAttemptDTO {
  _id?: string;
  quizId: string;
  studentId: string;
  courseId?: string;
  answers: { [questionId: string]: string | string[] } | Answer[];
  score: number;
  totalPoints: number;
  isCompleted?: boolean;
  submittedAt?: string | null; // ISO 字符串
  attemptNumber?: number;
  startedAt?: string | null;   // ISO 字符串
  timeSpent?: number; // in seconds (matching backend)
  createdAt?: string;          // ISO 字符串
  updatedAt?: string;          // ISO 字符串
}

// UI Model Types for QuizAttempt
export interface QuizAttempt {
  _id?: string;
  quizId: string;
  studentId: string;
  courseId?: string;
  answers: { [questionId: string]: string | string[] } | Answer[];
  score: number;
  totalPoints: number;
  isCompleted?: boolean;
  submittedAt?: Date | null; // UI 使用 Date 对象
  attemptNumber?: number;
  startedAt?: Date | null;   // UI 使用 Date 对象
  timeSpent?: number; // in seconds (matching backend)
  createdAt?: Date | null;   // UI 使用 Date 对象
  updatedAt?: Date | null;   // UI 使用 Date 对象
}

export interface Answer {
  questionId: string;
  studentAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

// 转换函数：API 边界统一处理 string ↔ Date 转换
export const convertQuizDTOToQuiz = (dto: QuizDTO): Quiz => {
  return {
    ...dto,
    availableDate: dto.availableDate ? new Date(dto.availableDate) : null,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    untilDate: dto.untilDate ? new Date(dto.untilDate) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
};

export const convertQuizToQuizDTO = (quiz: Quiz): QuizDTO => {
  return {
    ...quiz,
    availableDate: quiz.availableDate ? quiz.availableDate.toISOString() : null,
    dueDate: quiz.dueDate ? quiz.dueDate.toISOString() : null,
    untilDate: quiz.untilDate ? quiz.untilDate.toISOString() : null,
    createdAt: quiz.createdAt.toISOString(),
    updatedAt: quiz.updatedAt.toISOString(),
  };
};

export const convertQuizAttemptDTOToQuizAttempt = (dto: QuizAttemptDTO): QuizAttempt => {
  return {
    ...dto,
    submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : null,
    startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
    createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
  };
};

export const convertQuizAttemptToQuizAttemptDTO = (attempt: QuizAttempt): QuizAttemptDTO => {
  return {
    ...attempt,
    submittedAt: attempt.submittedAt ? attempt.submittedAt.toISOString() : null,
    startedAt: attempt.startedAt ? attempt.startedAt.toISOString() : null,
    createdAt: attempt.createdAt ? attempt.createdAt.toISOString() : undefined,
    updatedAt: attempt.updatedAt ? attempt.updatedAt.toISOString() : undefined,
  };
};


