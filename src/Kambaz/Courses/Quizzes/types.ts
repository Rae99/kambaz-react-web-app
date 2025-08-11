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
  availableDate?: Date;
  dueDate?: Date;
  untilDate?: Date;
  questions: Question[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface QuizFormData {
  title: string;
  description: string;
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
  availableDate?: string;
  dueDate?: string;
  untilDate?: string;
  questions: Question[];
  isPublished: boolean;
}
