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
  availableDate?: string; // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  dueDate?: string;       // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  untilDate?: string;     // ISO 8601 格式: "2024-01-01T00:00:00.000Z"
  questions: Question[];
  questionGroups?: QuestionGroup[]; // Optional question groups
  isPublished: boolean;
  createdAt: string;      // ISO 8601 格式
  updatedAt: string;      // ISO 8601 格式
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
  // Question grouping
  groupId?: string; // ID of the question group this question belongs to
}

export interface QuestionGroup {
  id: string;
  name: string;
  description?: string;
  points?: number; // Optional group-level points
  pickQuestions?: number; // Number of questions to randomly pick from this group (0 = all)
  questionsPerPage?: number; // For pagination within group
}

export interface BlankOption {
  id: string; // unique identifier for the blank
  options: string[]; // dropdown options for this blank
  correctAnswer: string; // which option is correct for this blank
}

export interface QuizAttempt {
  _id?: string;
  quizId: string;
  studentId: string;
  courseId?: string;
  answers: { [questionId: string]: string | string[] } | Answer[];
  score: number;
  totalPoints: number;
  isCompleted?: boolean;
  submittedAt?: Date;
  attemptNumber?: number;
  startedAt?: Date;
  timeSpent?: number; // in seconds (matching backend)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Answer {
  questionId: string;
  studentAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}


