export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  courseId: string;
  timeLimit?: number; // in minutes
  availableDate?: Date; // when quiz becomes available
  dueDate?: Date;
  isPublished: boolean;
  questions: Question[];
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
  timeLimit?: number;
  availableDate?: string;
  dueDate?: string;
  isPublished: boolean;
  questions: Question[];
  quizType?: string;
  shuffleAnswers?: boolean;
  allowMultipleAttempts?: boolean;
  showCorrectAnswers?: boolean;
}
