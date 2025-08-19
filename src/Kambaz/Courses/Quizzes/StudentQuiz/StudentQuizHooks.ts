import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as quizzesClient from '../client';
import { canStudentTakeQuiz } from '../services';
import type { Quiz, Question, QuizAttempt } from '../types';

/**
 * StudentQuizHooks - Custom hooks for student quiz functionality
 * 
 * This file contains custom hooks that manage the state and business logic
 * for the student quiz feature, separating concerns from the UI components.
 */

interface StudentQuizAttempt {
  _id?: string;
  studentId: string;
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  totalPoints: number;
  isCompleted: boolean;
  submittedAt: Date;
  attemptNumber: number;
}

export const useStudentQuiz = (qid: string, initialMode: 'take' | 'review') => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [mode, setMode] = useState<'take' | 'review'>(initialMode);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<StudentQuizAttempt>({
    studentId: currentUser?._id || '',
    quizId: qid || '',
    answers: {},
    score: 0,
    totalPoints: 0,
    isCompleted: false,
    submittedAt: new Date(),
    attemptNumber: 1,
  });
  const [existingAttempts, setExistingAttempts] = useState<QuizAttempt[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Start timer when quiz begins
  useEffect(() => {
    if (mode === 'take' && !startTime) {
      setStartTime(new Date());
    }
  }, [mode, startTime]);

  // Update current time every second for real-time timer
  useEffect(() => {
    if (mode === 'take' && startTime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, startTime]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (mode === 'take' && quiz?.timeLimit && startTime) {
      const timeSpent = getTimeSpent();
      const timeLimitSeconds = quiz.timeLimit * 60;

      if (timeSpent >= timeLimitSeconds) {
        // Time's up! Auto-submit the quiz
        handleSubmitQuiz();
      }
    }
  }, [currentTime, quiz?.timeLimit, startTime, mode]);

  // Calculate time spent in seconds (matching backend schema)
  const getTimeSpent = () => {
    if (!startTime) return 0;
    const diffMs = currentTime.getTime() - startTime.getTime();
    return Math.round(diffMs / 1000); // Convert to seconds
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!quiz?.timeLimit || !startTime) return null;
    const timeSpent = getTimeSpent();
    const remainingSeconds = quiz.timeLimit * 60 - timeSpent;
    if (remainingSeconds <= 0) return null;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch quiz data and check availability
  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);

          setQuiz(quizData);

          // Check if student can take this quiz
          if (mode === 'take') {
            await checkQuizAvailability(quizData);
          }

          setQuizAttempt((prev) => ({
            ...prev,
            totalPoints: quizData.questions.reduce(
              (sum: number, q: Question) => sum + q.points,
              0
            ),
          }));

          // Load existing attempts for this student
          if (currentUser?._id) {
            try {
              const attempts = await quizzesClient.getStudentAttempts(
                qid,
                currentUser._id
              );
              setExistingAttempts(attempts);
            } catch (error) {
              console.error('Failed to load attempts:', error);
              // Don't show error for attempts loading
            }
          }
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid, mode, currentUser?._id]);

  const checkQuizAvailability = async (quizData: Quiz) => {
    try {
      const result = await canStudentTakeQuiz(quizData, currentUser?._id!);

      if (!result.canTake) {
        setError(result.reason || 'Quiz is not available');
        return;
      }

      // Get existing attempts for this student and quiz
      const attempts = await quizzesClient.getStudentAttempts(
        qid!,
        currentUser?._id!
      );
      setExistingAttempts(attempts);

      const currentAttemptNumber = attempts.length + 1;

      setQuizAttempt((prev) => ({
        ...prev,
        attemptNumber: currentAttemptNumber,
      }));
    } catch (error) {
      console.error('Error checking quiz availability:', error);
    }
  };

  // Helper function to check if a question is fully answered
  const isQuestionAnswered = (question: Question): boolean => {
    const currentQuestionId = `question_${currentQuestionIndex}`;
    const answer = quizAttempt.answers[currentQuestionId];

    if (question.type === 'fill-in-the-blank' && question.blanks) {
      // For fill-in-the-blank, check if all blanks have answers
      const userAnswers = (answer as string[]) || [];
      return question.blanks.every(
        (_, index) => userAnswers[index] && userAnswers[index].trim() !== ''
      );
    }

    // For other question types, just check if answer exists
    return !!answer;
  };

  // Helper function to check if all questions are answered
  const areAllQuestionsAnswered = (): boolean => {
    if (!quiz) return false;
    return quiz.questions.every((question, index) => {
      const questionId = `question_${index}`;
      const answer = quizAttempt.answers[questionId];

      if (question.type === 'fill-in-the-blank' && question.blanks) {
        const userAnswers = (answer as string[]) || [];
        return question.blanks.every(
          (_, blankIndex) =>
            userAnswers[blankIndex] && userAnswers[blankIndex].trim() !== ''
        );
      }

      return !!answer;
    });
  };

  // Handle answer changes
  const handleAnswerChange = (
    answer: string | string[]
  ) => {
    // Use the same key logic as the rest of the component
    const answerKey = `question_${currentQuestionIndex}`;

    const newAnswers = {
      ...quizAttempt.answers,
      [answerKey]: answer,
    };

    setQuizAttempt((prev) => {
      const updated = {
        ...prev,
        answers: newAnswers,
      };
      return updated;
    });

    // Auto-save answers as student progresses (using saveQuizProgress, not submit)
    if (qid) {
      quizzesClient
        .saveQuizProgress(qid, newAnswers, getTimeSpent())
        .then((savedAttempt) => {
          setQuizAttempt(savedAttempt);
        })
        .catch((error) => {
          console.error('Auto-save failed:', error);
          // Don't show error to user for auto-save failures
        });
    }
  };

  // Handle blank answer changes
  const handleBlankAnswerChange = (blankIndex: number, answer: string) => {
    const answerKey = `question_${currentQuestionIndex}`;

    const currentAnswers = (quizAttempt.answers[answerKey] as string[]) || [];
    const newAnswers = [...currentAnswers];
    newAnswers[blankIndex] = answer;

    const updatedAnswers = {
      ...quizAttempt.answers,
      [answerKey]: newAnswers,
    };

    setQuizAttempt((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));

    // Auto-save answers
    if (qid) {
      quizzesClient
        .saveQuizProgress(qid, updatedAnswers, getTimeSpent())
        .then((savedAttempt) => {
          setQuizAttempt(savedAttempt);
        })
        .catch((error) => {
          console.error('Auto-save failed:', error);
        });
    }
  };

  // Navigation functions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    try {
      // Check if all questions are answered
      const totalQuestions = quiz?.questions?.length || 0;
      const answeredQuestions = Object.keys(quizAttempt.answers).length;

      if (answeredQuestions < totalQuestions) {
        setError(
          `Please answer all ${totalQuestions} questions before submitting. You have answered ${answeredQuestions} questions.`
        );
        return;
      }

      // Calculate score locally using the same logic as Faculty Preview
      let localScore = 0;
      quiz?.questions.forEach((question, index) => {
        const questionId = `question_${index}`;
        const userAnswer = quizAttempt.answers[questionId];

        if (userAnswer) {
          if (question.type === 'fill-in-the-blank' && question.blanks) {
            // For fill-in-the-blank, check if all blanks are answered correctly
            if (Array.isArray(userAnswer) && userAnswer.length === question.blanks.length) {
              const allCorrect = question.blanks.every(
                (blank, blankIndex) => userAnswer[blankIndex] === blank.correctAnswer
              );
              if (allCorrect) {
                localScore += question.points;
              }
            }
          } else if (Array.isArray(question.correctAnswer)) {
            // For multiple-choice with multiple correct answers
            if (
              Array.isArray(userAnswer) &&
              userAnswer.length === question.correctAnswer.length &&
              userAnswer.every((ans) => question.correctAnswer.includes(ans))
            ) {
              localScore += question.points;
            }
          } else {
            // For single-answer questions (true/false, single multiple-choice)
            if (userAnswer === question.correctAnswer) {
              localScore += question.points;
            }
          }
        }
      });

      // Prepare answers with question context for backend processing
      const answersWithContext =
        quiz?.questions?.map((question, index) => {
          const questionId = `question_${index}`;
          
          // For fill-in-the-blank questions, construct correctAnswer from blanks
          let correctAnswer = question.correctAnswer;
          if (question.type === 'fill-in-the-blank' && question.blanks) {
            correctAnswer = question.blanks.map(blank => blank.correctAnswer);
          }
          
          return {
            questionIndex: index,
            questionText: question.text,
            userAnswer: quizAttempt.answers[questionId] || '',
            correctAnswer: correctAnswer,
            points: question.points,
            questionType: question.type,
            blanks: question.blanks, // Include blanks for backend processing
          };
        }) || [];

      // Use the new submit API for final submission
      const savedAttempt = await quizzesClient.submitQuizAttempt(
        qid!,
        answersWithContext,
        getTimeSpent() // Pass time spent in seconds
      );

      // Update local state with the submitted attempt, but use our local score
      setQuizAttempt({
        ...savedAttempt,
        score: localScore, // Use our local calculation instead of backend score
      });

      // Navigate to review mode to show results
      setMode('review');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit your quiz');
    }
  };

  // Take quiz again
  const handleTakeQuiz = () => {
    setMode('take');
    setCurrentQuestionIndex(0);
    setStartTime(new Date()); // Reset timer for new attempt
    setQuizAttempt({
      studentId: currentUser?._id || '',
      quizId: qid || '',
      answers: {},
      score: 0,
      totalPoints: quiz?.questions.reduce((sum, q) => sum + q.points, 0) || 0,
      isCompleted: false,
      submittedAt: new Date(),
      attemptNumber: existingAttempts.length + 1,
    });
  };

  // Review attempt
  const handleReviewAttempt = (attempt: QuizAttempt) => {
    // Convert QuizAttempt to StudentQuizAttempt format
    const studentAttempt: StudentQuizAttempt = {
      _id: attempt._id,
      studentId: attempt.studentId || currentUser?._id || '',
      quizId: attempt.quizId || qid,
      answers: typeof attempt.answers === 'object' && !Array.isArray(attempt.answers) 
        ? attempt.answers 
        : {},
      score: attempt.score || 0,
      totalPoints: attempt.totalPoints || 0,
      isCompleted: !!attempt.submittedAt,
      submittedAt: attempt.submittedAt ? new Date(attempt.submittedAt) : new Date(),
      attemptNumber: attempt.attemptNumber || 1,
    };
    setQuizAttempt(studentAttempt);
    setMode('review');
  };

  return {
    mode,
    setMode,
    quiz,
    loading,
    error,
    currentQuestionIndex,
    quizAttempt,
    existingAttempts,
    startTime,
    currentTime,
    getTimeSpent,
    getRemainingTime,
    isQuestionAnswered,
    areAllQuestionsAnswered,
    handleAnswerChange,
    handleBlankAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitQuiz,
    handleTakeQuiz,
    handleReviewAttempt,
  };
};
