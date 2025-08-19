import { useState, useEffect } from 'react';
import * as quizzesClient from '../client';
import type { Quiz, Question } from '../types';

/**
 * QuizPreviewHooks - Custom hooks for quiz preview functionality
 * 
 * This file contains custom hooks that manage the state and business logic
 * for the quiz preview feature, separating concerns from the UI components.
 */

interface QuizAttempt {
  answers: { [questionId: string]: string | string[] };
  score: number;
  totalPoints: number;
  isCompleted: boolean;
}

export const useQuizPreview = (qid: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt>({
    answers: {},
    score: 0,
    totalPoints: 0,
    isCompleted: false,
  });

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          setLoading(true);
          const quizData = await quizzesClient.findQuizById(qid);
          setQuiz(quizData);
          setQuizAttempt((prev) => ({
            ...prev,
            totalPoints: quizData.questions.reduce(
              (sum: number, q: Question) => sum + q.points,
              0
            ),
          }));
        } catch (error) {
          console.error('Error fetching quiz:', error);
          setError('Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid]);

  // Helper function to check if a question is fully answered
  const isQuestionAnswered = (question: Question, questionIndex: number): boolean => {
    const answer = quizAttempt.answers[questionIndex];
    
    if (question.type === 'fill-in-the-blank' && question.blanks) {
      // For fill-in-the-blank, check if all blanks have answers
      const userAnswers = answer as string[] || [];
      return question.blanks.every((_, index) => 
        userAnswers[index] && userAnswers[index].trim() !== ''
      );
    }
    
    // For other question types, just check if answer exists
    return !!answer;
  };

  // Helper function to check if all questions are answered
  const areAllQuestionsAnswered = (): boolean => {
    if (!quiz) return false;
    return quiz.questions.every((question, index) => isQuestionAnswered(question, index));
  };

  // Handle answer changes
  const handleAnswerChange = (
    questionIndex: number,
    answer: string | string[]
  ) => {
    setQuizAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer,
      },
    }));
  };

  // Handle blank answer changes
  const handleBlankAnswerChange = (
    questionIndex: number,
    blankIndex: number,
    answer: string
  ) => {
    setQuizAttempt((prev) => {
      const currentAnswers = (prev.answers[questionIndex] as string[]) || [];
      const newAnswers = [...currentAnswers];
      newAnswers[blankIndex] = answer;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionIndex]: newAnswers,
        },
      };
    });
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

  // Submit quiz and calculate score
  const handleSubmitQuiz = () => {
    // Calculate score based on answers
    let score = 0;
    quiz?.questions.forEach((question: Question, questionIndex: number) => {
      const userAnswer = quizAttempt.answers[questionIndex];

      if (userAnswer) {
        if (question.type === 'fill-in-the-blank' && question.blanks) {
          // New fill-in-the-blank with dropdown selections
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === question.blanks.length
          ) {
            // Check if all blanks are answered correctly
            const allCorrect = question.blanks.every(
              (blank, index) => userAnswer[index] === blank.correctAnswer
            );
            if (allCorrect) {
              score += question.points;
            }
          }
        } else if (Array.isArray(question.correctAnswer)) {
          // Multiple correct answers (legacy or other types)
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every((ans) => question.correctAnswer.includes(ans))
          ) {
            score += question.points;
          }
        } else {
          // Single correct answer
          if (userAnswer === question.correctAnswer) {
            score += question.points;
          }
        }
      }
    });

    setQuizAttempt((prev) => ({
      ...prev,
      score,
      isCompleted: true,
    }));
  };

  return {
    quiz,
    loading,
    error,
    currentQuestionIndex,
    quizAttempt,
    isQuestionAnswered,
    areAllQuestionsAnswered,
    handleAnswerChange,
    handleBlankAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitQuiz,
  };
};
