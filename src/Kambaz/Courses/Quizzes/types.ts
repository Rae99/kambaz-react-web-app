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
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  availableDate?: string; // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  dueDate?: string;       // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  untilDate?: string;     // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  questions: Question[];
  isPublished: boolean;
  createdAt: string;      // ISO 8601 格式
  updatedAt: string;      // ISO 8601 格式
}

export interface Question {
  _id?: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  text: string;
  points: number;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[]; // single answer or array for multiple correct answers
  explanation?: string;
}

export interface QuizAttempt {
  _id?: string;
  quizId: string;
  studentId: string;
  courseId: string;
  answers: Answer[];
  score: number;
  totalPoints: number;
  submittedAt: Date;
  timeSpent: number; // in minutes
}

export interface Answer {
  questionId: string;
  studentAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}


